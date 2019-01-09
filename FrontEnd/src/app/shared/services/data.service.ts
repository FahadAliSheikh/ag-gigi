import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
 providedIn: 'root'
})
export class DataService {

 private companyData = new Subject<any>();
 private buyerData = new Subject<any>();
 private concernedPersonData = new Subject<any>();

 currentCompanyData = this.companyData.asObservable();
 currentBuyerData = this.buyerData.asObservable();
 currentConcernedPersonData = this.concernedPersonData.asObservable();

 constructor() { }

 changeCompany(company: Company) {
   this.companyData.next(company)
 }

 changeBuyer(buyer: Buyer) {
   this.buyerData.next(buyer)
 }

 changeConcernedPerson(concernedPerson: ConcernedPerson) {
   this.concernedPersonData.next(concernedPerson)
 }

}
export interface Company {
 _id: string;
 company_name: string;
 company_address: string;
 company_telephone: string;
 buyer;
}
export interface Buyer {
 _id: string;
 concerned_person: string;
 concerned_person_email: string;
 concerned_person_phone: string;
}
export interface ConcernedPerson {
 _id: string;
 buyer_name: string;
 concerned_person;
}