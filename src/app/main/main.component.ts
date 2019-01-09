import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router';

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';

import 'uikit'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  // The FireStore collection
  private tasks: AngularFirestoreCollection<any>
  user = null

  // Form controls
  title = new FormControl('')
  project = new FormControl('')
  text = new FormControl('')

  items: Observable<any[]> = null

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    // Get collection
    this.tasks = null

    const user = this.afAuth.user.subscribe(user => {
      if (user == null) {
        this.router.navigate(['/login'])
        return
      }

      this.user = {
        email: user.email
      }

      this.tasks = this.afs.collection<any>(`todo/${user.uid}/tasks`)

      // Create subscription and transform items, removing all metadata except for the ID
      this.items = this.tasks.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return { id, ...data }
        }))
      )
    })
  }

  /** Create a new task */
  save() {
    this.tasks.add({
      title: this.title.value,
      project: this.project.value,
      text: this.text.value
    })

    // UI feedback
    UIkit.modal('#newTaskModal').hide()
    const uikit:any = UIkit
    uikit.notification("Task created", {status: 'success', pos: 'bottom-center'})
  }

  /** Delete a task */
  delete(item) {
    // Fetch reference to document
    const doc = this.tasks.doc(item.id)

    doc.delete()

    // UI feedback
    const uikit:any = UIkit
    uikit.notification("Task deleted", {status: 'success', pos: 'bottom-center'})
  }

  logout() {
    this.afAuth.auth.signOut()
  }
}
