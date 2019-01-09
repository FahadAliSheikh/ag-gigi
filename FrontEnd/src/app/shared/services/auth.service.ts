import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { User } from './user';

//service inside a service
import { UrlService } from './url.service';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private url = this.urlService.basicUrl + 'user/';
  public user = this.loadUser();
  authToken;
  httpOptions;
  public signedIn = this.loadStatus();
  redirectUrl: string;


  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private router: Router,
    public urlService: UrlService,

  ) { }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "server error");
  }

  signUp(user): Observable<User> {
    return this.httpClient.post<User>(this.url + '/signup', user)
      .pipe(
        tap(
          user => {
            catchError(this.errorHandler);
          }
        )
      )
  }


  logIn(user): Observable<User> {
    return this.httpClient.post<User>(this.url + '/login', user)
      .pipe(
        tap(
          user => {
            console.log(user);
            this.messageService.successMessage = user.message;
          },
          error => {
            console.log(error);
            this.messageService.errorMessage = error.error.message;
            console.log(this.messageService.errorMessage);
          }
        )
      )
  }


  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('isSignedIn', JSON.parse("true"));
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.authToken = token;
    this.signedIn = true;
  }

  signOut() {
    this.authToken = null; // Set token to null
    this.user = null;
    localStorage.clear(); // Clear local storage
    this.signedIn = false;
  }

  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  loadStatus() {
    return JSON.parse(localStorage.getItem('isSignedIn'));
  }
  loadUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

}
