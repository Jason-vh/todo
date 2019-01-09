import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import 'uikit'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = new FormControl('');
  project = new FormControl('');
  text = new FormControl('');


  // private itemDoc: AngularFirestoreDocument<Item>;
  // item: Observable<any>;
  // constructor(private afs: AngularFirestore) {
  //   this.itemDoc = afs.doc<any>('items/1');
  //   this.item = this.itemDoc.valueChanges();
  // }
  // update(item: any) {
  //   this.itemDoc.update(item);
  // }



  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('todo')
    console.log(this.itemsCollection)
    this.items = this.itemsCollection.snapshotChanges();

    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  addItem(item: any) {
    this.itemsCollection.add(item);
  }

  ngOnInit() {

    console.log('hi')
  }

  save() {
    console.log(this.project.value)
    console.log(this.title.value)
    console.log(this.text.value)

    this.itemsCollection.add({
      title: this.title.value,
      project: this.project.value,
      text: this.text.value
    })

    UIkit.modal('#newTaskModal').hide()
    const uikit:any = UIkit

    uikit.notification("Task created", {status: 'success', pos: 'bottom-center'})
  }

  delete(item) {
    console.log(item)
    const doc = this.itemsCollection.doc(item.id)

    doc.delete()

    const uikit:any = UIkit

    uikit.notification("Task deleted", {status: 'success', pos: 'bottom-center'})
  }
}
