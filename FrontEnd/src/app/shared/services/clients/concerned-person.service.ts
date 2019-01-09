
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

//services
import { AuthService } from '.././auth.service';
import { IncomingPackage, incomingMerchandiser, incomingCompanies, buyer, concerned } from '.././incoming_package_schema';
import { MessageService } from '.././message.service';
import { UrlService } from '../url.service';

@Injectable({
  providedIn: 'root'
})
export class ConcernedPersonService {

  authToken;
  httpOptions;
  redirectUrl;
  private concernedPersonUrl = this.urlService.basicUrl + "concerned/"

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    private urlService: UrlService,

  ) { }


  errorHandler(error: HttpErrorResponse) {
    //console.log(error);
    return throwError(error || "server error");
  }


  loadToken() {
    this.authToken = localStorage.getItem('token');
  }
  addHeaders() {
    this.loadToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
  }

  getOptions(): Object {
    return this.httpOptions;
  }

  //get all companies
  getAllPersons(buyer_id): Observable<concerned> {
    this.addHeaders();
    return this.httpClient.get<concerned>(this.concernedPersonUrl + '?buyer_id=' + buyer_id, this.getOptions())
      .pipe(
        tap(companies => {
          catchError(this.errorHandler)
        })
      )
  }

  //get one person
  getOnePerson(person_id): Observable<concerned> {
    this.addHeaders();
    return this.httpClient.get<concerned>(this.concernedPersonUrl + person_id, this.getOptions())
      .pipe(
        tap(
          concerned => {
            this.messageService.successMessage = "edit this person";
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //edit person
  editPerson(person_id, person): Observable<concerned> {
    this.addHeaders();
    return this.httpClient.put<concerned>(this.concernedPersonUrl + person_id, person, this.getOptions())
      .pipe(
        tap(
          person => {
            this.messageService.successMessage = person.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //delete person
  deletePerson(person_id, buyer_id): Observable<concerned> {
    this.addHeaders();
    return this.httpClient.delete<concerned>(this.concernedPersonUrl + person_id + '?buyer_id=' + buyer_id, this.getOptions())
      .pipe(
        tap(
          deleted => {
            this.messageService.successMessage = deleted.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }
}
