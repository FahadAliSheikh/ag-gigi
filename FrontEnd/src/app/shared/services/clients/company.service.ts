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
export class CompanyService {

  authToken;
  httpOptions;
  redirectUrl;

  private companyUrl = this.urlService.basicUrl + "company/"

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
  getAllCompanies(): Observable<incomingCompanies> {
    this.addHeaders();
    return this.httpClient.get<incomingCompanies>(this.companyUrl, this.getOptions())
      .pipe(
        tap(companies => {
          catchError(this.errorHandler)
        })
      )
  }

  //get one company
  getOneCompany(company_id): Observable<incomingCompanies> {
    this.addHeaders();
    return this.httpClient.get<incomingCompanies>(this.companyUrl + company_id, this.getOptions())
      .pipe(
        tap(
          company => {
            this.messageService.successMessage = "edit this company";
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //edit company
  editCompany(company_id, company): Observable<incomingCompanies> {
    this.addHeaders();
    return this.httpClient.put<incomingCompanies>(this.companyUrl + company_id, company, this.getOptions())
      .pipe(
        tap(
          company => {
            this.messageService.successMessage = company.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //delete a company
  deleteCompany(company_id): Observable<incomingCompanies> {
    this.addHeaders();
    return this.httpClient.delete<incomingCompanies>(this.companyUrl + company_id, this.getOptions())
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
