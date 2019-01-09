import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    singupForm: FormGroup;
    messageClass;
    message;
    emailValid;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        public messageService: MessageService,
    ) { }
    createForm() {
        this.singupForm = this.fb.group({
            username: [
                '',
                Validators.required
            ],
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    this.validateEmail
                ])
            ],
            password: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(12),
                ])
            ],
            // confirm: [
            //     '',
            //     Validators.compose([
            //         Validators.required,
            //     ])
            // ],
            userRole: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ]


        });
    }


    onSingUpSubmit() {
        const user = {
            email: this.singupForm.get('email').value,
            password: this.singupForm.get('password').value,
            username: this.singupForm.get('username').value,
            userRole: this.singupForm.get('userRole').value,
        }
        this.authService.signUp(user).subscribe(
            data => {
                console.log(data);
                this.messageClass = "alert alert-success"
                this.message = data.message;
                this.router.navigate(['/login']);
            },
            err => {
                this.messageClass = "alert alert-danger";
                this.message = err.error.message;
                console.log(err.error.message);

            },
            () => {
                // this.messageClass='alert alert-success';
                // this.message="succeeded";
                // this.router.navigate(['/signin']);
                //this.router.navigate(['/login']);
            
            }
        )

    }
    get email() {
        return this.singupForm.get('email');
    }
    get password() {
        return this.singupForm.get('password');
    }
    get confirm() {
        return this.singupForm.get('confirm');
    }
    get username() {
        return this.singupForm.get('username');
    }
    get mobile() {
        return this.singupForm.get('mobile');
    }
    get userRole() {
        return this.singupForm.get('userRole');
    }

    // Function to validate e-mail is proper format
    validateEmail(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid email
        } else {
            return { 'validateEmail': true } // Return as invalid email
        }
    }





    ngOnInit() {
        this.createForm();
    }

}
