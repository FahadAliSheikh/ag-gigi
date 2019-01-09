import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  singInForm: FormGroup;
  messageClass;
  message;


  constructor(
    private fb: FormBuilder,
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
  ) { }

  createForm() {
    this.singInForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  get email() {
    return this.singInForm.get('email');
  }
  get password() {
    return this.singInForm.get('password');
  }

  onSingInSubmit() {
    const user = {
      email: this.singInForm.get('email').value,
      password: this.singInForm.get('password').value
    }
    this.authService.logIn(user).subscribe(
      data => {
        //console.log(data.message);
        this.authService.storeUserData(data.token, data.userData);
        // this.messageClass = 'alert alert-success';
        // this.message = data.message;

        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/production';
        this.router.navigate([redirect]);
      },
      err => {
        this.messageClass = "alert alert-danger";
        this.message = err.error.message;
        //this.messageService.errorMessage = err.error.message;
        // console.log(err.error.message);
        // console.log(this.messageService.errorMessage);
      },
      () => {
        setTimeout(() => {
          this.messageService.successMessage = ""
          this.messageService.errorMessage = "";

        }, 2500)

      }
    )
  }

  checkLogin() {
    if (this.authService.signedIn) {
      this.router.navigate(['/production']);
    }
  }

  ngOnInit() {
    this.checkLogin();
    this.createForm()
  }

  onLoggedin() {
    localStorage.setItem('isLoggedin', 'true');
  }
}
