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
export class BuyerService {

  authToken;
  httpOptions;
  redirectUrl;
  private buyerUrl = this.urlService.basicUrl + "buyer/"

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
  getAllBuyers(company_id): Observable<buyer> {
    this.addHeaders();
    return this.httpClient.get<buyer>(this.buyerUrl + '?company_id=' + company_id, this.getOptions())
      .pipe(
        tap(companies => {
          catchError(this.errorHandler)
        })
      )
  }

  //get one buyer
  getOneBuyer(buyer_id): Observable<buyer> {
    this.addHeaders();
    return this.httpClient.get<buyer>(this.buyerUrl + buyer_id, this.getOptions())
      .pipe(
        tap(
          buyer => {
            this.messageService.successMessage = "edit this buyer";
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //edit buyer
  editBuyer(buyer_id, buyer): Observable<buyer> {
    this.addHeaders();
    return this.httpClient.put<buyer>(this.buyerUrl + buyer_id, buyer, this.getOptions())
      .pipe(
        tap(
          buyer => {
            this.messageService.successMessage = buyer.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      )
  }

  //delete buyer
  deleteBuyer(buyer_id, company_id): Observable<buyer> {
    this.addHeaders();
    return this.httpClient.delete<buyer>(this.buyerUrl + buyer_id + '?company_id=' + company_id, this.getOptions())
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
