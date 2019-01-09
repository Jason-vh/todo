import { AngularFireAuth } from '@angular/fire/auth'
import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'

import 'uikit'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Form controls
  email = new FormControl('')
  password = new FormControl('')

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  async login() {
    UIkit.modal('#loginLoadingModal').show()

    try {
      const res = await this.firebaseAuth.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
      this.router.navigate(['/'])
    } catch (error) {
      // Redefinition needed due to error in @types/uikit
      const uikit:any = UIkit
      uikit.notification(`<small>${error}</small>`, { status: 'danger' })
    } finally {
      // setTimeout is due to the modal sometimes trying to hide before it has finished showing, and then breaking
      UIkit.modal('#loginLoadingModal').hide()
      setTimeout(() => {
        UIkit.modal('#loginLoadingModal').hide()
      }, 300)
    }
  }

}
