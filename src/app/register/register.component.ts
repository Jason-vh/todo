import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth'

import 'uikit'
import { Router } from '@angular/router'

// Redefinition needed due to error in @types/uikit
const uikit:any = UIkit

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Form controls
  email = new FormControl('')
  password = new FormControl('')

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  async register() {
    console.log(this.email.value)
    console.log(this.password.value)

    UIkit.modal('#registerLoadingModal').show()

    try {
      await this.firebaseAuth.auth.createUserWithEmailAndPassword(this.email.value, this.password.value)

      // Feedback
      uikit.notification(`<small class='uk-text-center'>Registration successful.</small>`, { status: 'success' })

      // Navigate
      this.router.navigate(['/login'])
    } catch (error) {
      // Feedback
      uikit.notification(`<small class='uk-text-center'>${error}</small>`, { status: 'danger' })
    } finally {
      // setTimeout is due to the modal sometimes trying to hide before it has finished showing, and then breaking
      UIkit.modal('#loginLoadingModal').hide()
      setTimeout(() => {
        UIkit.modal('#registerLoadingModal').hide()
      }, 300)
    }
  }

}
