import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';

//service inside a service
import { UrlService } from './url.service';



interface dropDown {
  coatings;
  packageFormats;
  cuts;
  secondaryPrints
  threads;
  pastings;
  special_requirements;
  foldings;
  perforations;
  descriptions;
  coatedSides;
  primaryPackings;
  pallets;
  cartons;
  barCodes;
  deliverbys;
}

interface machines {
  cuttingMachines;
  printingMachines;
}

@Injectable({
  providedIn: 'root'
})
export class CostingService {

  private estimationUrl = this.urlService.basicUrl + 'estimation/';
  private costingUrl = this.urlService.basicUrl + 'costing/';
  private dropDownUrl = this.urlService.basicUrl + 'dropdown/';


  constructor(
    private httpClient: HttpClient,
    public urlService: UrlService,

  ) { }

  getCostings(object) {
    //    let data = { limit: "2" };
    return this.httpClient.get(this.estimationUrl, { params: object });
  }

  // get_barcodes 
  getAllBarCodes(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_barcodes')
  }


  // get_coatings 
  getAllCoatings(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_coatings')
  }
  // getCuts
  getAllPackageFormats(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_package_formats')
  }
  // getCuts
  getAllCuts(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_cuts')
  }
  //getSecondaryPrints
  getSecondaryPrints(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_secondary_prints')
  }

  // get_threads
  getAllThreads(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_threads')
  }
  //get_pastings 
  getAllPastings(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_pastings')
  }
  // get_special_reqs
  getAllSpecialReqs(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_special_reqs')
  }
  // get foldings
  getAllFoldings(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_foldings')
  }
  // get_perforations 
  getAllPerforations(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_perforations')
  }
  // get_descriptions
  getAllDescriptions(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_descriptions')
  }
  // get_coated_sides
  getAllCoatedSides(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_coated_sides')
  }
  // get_primary_packings
  getAllPrimaryPackings(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_primary_packings')
  }
  // get_cartons
  getAllCartons(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_cartons')
  }
  // get_pallets 
  getAllPallets(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_pallets')
  }
  //get deliver bys
  getAllDeliverBys(): Observable<dropDown> {
    return this.httpClient.get<dropDown>(this.dropDownUrl + 'get_deliverbys')
  }

  //get printing machines 
  getPrintingMachine(): Observable<machines> {
    return this.httpClient.get<machines>(this.costingUrl + 'get_printing_machines')
  }
  //get die cutting machines 
  getDieCuttingMachine(): Observable<machines> {
    return this.httpClient.get<machines>(this.costingUrl + 'get_diecutting_machines')
  }
  //get guillotine machines 
  getGuillotienMachine(): Observable<machines> {
    return this.httpClient.get<machines>(this.costingUrl + 'get_guillotinecutting_machines')
  }
}
