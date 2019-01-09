import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from './auth.service';

import { IncomingPackage, incomingMerchandiser, incomingCompanies, buyer, concerned } from './incoming_package_schema';
import { User } from './user';
import { MessageService } from './message.service';

//services
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class PackageInformationService {

  private packageUrl = this.urlService.basicUrl + 'pkg_spec/';
  comapniesUrl = this.urlService.basicUrl + "company/";
  buyersUrl = this.urlService.basicUrl + "buyer/";
  concernedPersonUrl = this.urlService.basicUrl + "concerned/";

  authToken;
  httpOptions;
  redirectUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    public urlService: UrlService,
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

  //get all packages
  getPackageSpec(): Observable<IncomingPackage> {
    this.addHeaders();
    //console.log("service is working");
    return this.httpClient.get<IncomingPackage>(this.packageUrl, this.getOptions())
      .pipe(
        tap(packages => {
          catchError(this.errorHandler)
        })
      )
  }

  //post one package
  savePackageSpec(packageSpec): Observable<IncomingPackage> {
    this.addHeaders();
    return this.httpClient.post<IncomingPackage>(this.packageUrl, packageSpec, this.getOptions())
      .pipe(
        tap(
          packages => {
            this.messageService.successMessage = packages.message
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        ),
        //        catchError(this.errorHandler)
      );
  }

  //post one package
  editPackageSpec(packageSpec, id): Observable<IncomingPackage> {
    this.addHeaders();
    return this.httpClient.put<IncomingPackage>(this.packageUrl + id, packageSpec, this.getOptions())
      .pipe(
        tap(
          packages => {
            this.messageService.successMessage = packages.message;
            //   console.log(packages);
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        ),
        // catchError(this.errorHandler)
      );
  }

  //get one specific package by id
  getOnePackageSpec(id): Observable<IncomingPackage> {
    this.addHeaders();
    return this.httpClient.get<IncomingPackage>(this.packageUrl + id, this.getOptions())
      .pipe(
        //tap(_ => this.log(`fetched one package`)),
        tap(
          foundPackage => {
            this.messageService.successMessage = foundPackage.message;
            //   console.log(packages);
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        ),
        // catchError(this.errorHandler)
      );
  }


  //Delete one specific package by id
  deletePackageSpec(id): Observable<User> {
    this.addHeaders();

    return this.httpClient.delete<User>(this.packageUrl + id, this.getOptions())
      .pipe(
        // catchError(this.errorHandler)
        tap(
          deleted => {
            this.messageService.successMessage = deleted.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          }
        )
      );
  }


  // get all productions
  getAllProductions(): Observable<incomingMerchandiser> {
    return this.httpClient.get<incomingMerchandiser>(this.packageUrl + 'get-all-production')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get all merchandisers
  getAllMerchandisers(): Observable<incomingMerchandiser> {
    return this.httpClient.get<incomingMerchandiser>(this.packageUrl + 'get-all-merchandisers')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  //get all companies
  getAllCompanies(): Observable<incomingCompanies> {
    return this.httpClient.get<incomingCompanies>(this.packageUrl + 'get-all-companies')
      .pipe(
        catchError(this.errorHandler)
      )
  }
  // addCompany(company): Observable<incomingCompanies> {
  //   this.addHeaders();
  //   console.log(company.get('company_name'));
  //   console.log(company.get('company_address'));
  //   console.log(company.get('company_telephone'));
  //   return this.httpClient.post<incomingCompanies>(this.comapniesUrl, company, this.getOptions())
  //     .pipe(
  //       tap(
  //         companies => {
  //           this.messageService.successMessage = companies.message;
  //         },
  //         error => {
  //           this.messageService.errorMessage = error.error.message;
  //         }
  //       ),
  //       //        catchError(this.errorHandler)
  //     );
  // }

  //post one package
  addCompany(company): Observable<incomingCompanies> {
    this.addHeaders();
    return this.httpClient.post<incomingCompanies>(this.comapniesUrl, company, this.getOptions())
      .pipe(
        tap(
          company => {
            this.messageService.successMessage = company.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          },
          () => {
            setTimeout(() => {
              this.messageService.successMessage = ""
              this.messageService.errorMessage = "";

            }, 2500)
          }
        ),

        //        catchError(this.errorHandler)
      );
  }

  addBuyer(buyer): Observable<buyer> {
    this.addHeaders();
    return this.httpClient.post<buyer>(this.buyersUrl, buyer, this.getOptions())
      .pipe(
        tap(
          buyer => {
            console.log(buyer);
            this.messageService.successMessage = buyer.messages;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          },
          () => {
            setTimeout(() => {
              this.messageService.successMessage = ""
              this.messageService.errorMessage = "";

            }, 2500)
          }
        ),
        //        catchError(this.errorHandler)
      );
  }
  addConcerned(concerned): Observable<concerned> {
    this.addHeaders();
    return this.httpClient.post<concerned>(this.concernedPersonUrl, concerned, this.getOptions())
      .pipe(
        tap(
          concerned => {
            this.messageService.successMessage = concerned.message;
          },
          error => {
            this.messageService.errorMessage = error.error.message;
          },
          () => {
            setTimeout(() => {
              this.messageService.successMessage = ""
              this.messageService.errorMessage = "";

            }, 2500)
          }
        ),
        //        catchError(this.errorHandler)
      );
  }






  //get all companies
  searchCompanies(search): Observable<incomingCompanies> {
    var searchItem = search.toLowerCase();
    return this.httpClient.get<incomingCompanies>(this.comapniesUrl + '/search-all-companies' + '?search=' + searchItem);
  }

  //search buyers
  searchBuyers(search): Observable<buyer> {
    var searchItem = search.searchItem.toLowerCase();
    var company_id = search.company_id;
    return this.httpClient.get<buyer>(this.buyersUrl + 'search-all-buyers' + '?search=' + searchItem + '&' + 'company_id=' + company_id);
  }

  //search concernedPerson
  searchConcernedPersons(search): Observable<concerned> {
    var searchItem = search.searchItem.toLowerCase();
    var buyer_id = search.buyer_id;
    return this.httpClient.get<concerned>(this.concernedPersonUrl + 'search-all-concerned' + '?search=' + searchItem + '&' + 'buyer_id=' + buyer_id);
  }

  // search package in costing
  searchPackages(search): Observable<IncomingPackage> {
    var searchItem = search.toLowerCase();
    return this.httpClient.get<IncomingPackage>(this.packageUrl + '/search-all-packages' + '?search=' + searchItem);
  }
}
