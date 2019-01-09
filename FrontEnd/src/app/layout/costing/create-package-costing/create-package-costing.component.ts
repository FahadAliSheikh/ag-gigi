import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ActivatedRoute} from '@angular/router'

import {PackageInformationService} from '../../../shared/services/package-information.service'
import { Router } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-create-package-costing',
  templateUrl: './create-package-costing.component.html',
  styleUrls: ['./create-package-costing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('expendMore1', [
      state('rotate', style({ transform: 'rotate(180deg)', transition: 'all .2s linear'})),
      state('notRotate', style({ transform: 'rotate(0deg)', transition: 'all .2s linear'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('expendMore2', [
      state('rotate', style({ transform: 'rotate(180deg)', transition: 'all .2s linear'})),
      state('notRotate', style({ transform: 'rotate(0deg)', transition: 'all .2s linear'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('expendMore3', [
      state('rotate', style({ transform: 'rotate(180deg)', transition: 'all .2s linear'})),
      state('notRotate', style({ transform: 'rotate(0deg)', transition: 'all .2s linear'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('expendMore4', [
      state('rotate', style({ transform: 'rotate(180deg)', transition: 'all .2s linear'})),
      state('notRotate', style({ transform: 'rotate(0deg)', transition: 'all .2s linear'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreatePackageCostingComponent implements OnInit {
  loading: boolean = true;
  package : any = {}
  constructor(
    private ActivatedRoute: ActivatedRoute,
    public packageInformationService: PackageInformationService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
  ) { }

  displayedColumns = ['item', 'cost'];
  transactions: Transaction[] = [
    {item: 'Material', cost: 4},
    {item: 'Printing Machine', cost: 5},
    {item: 'Die Machine', cost: 2},
    {item: 'Guillitine Machine', cost: 4},
    {item: 'Die', cost: 25},
    {item: 'Packing', cost: 15},
  ];

  
  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }


  view_more_stock : Boolean = false;
  view_more_no_of_press_sheet: Boolean = false;
  view_more_press_sheet: Boolean = false;
  view_more_no_of_ups: Boolean = false;
  viewMoreStock(){
    this.view_more_stock =!this.view_more_stock;
  }
  viewMoreNoOfPressSheets(){
    this.view_more_no_of_press_sheet = !this.view_more_no_of_press_sheet;
  }
  viewMorePressSheet(){
    this.view_more_press_sheet = !this.view_more_press_sheet;
  }
  viewMoreNoOfUps(){
    this.view_more_no_of_ups = !this.view_more_no_of_ups;
  }

  getOnePackageSpec() {
    this.loading = true;
    this.packageInformationService
      .getOnePackageSpec(this.ActivatedRoute.snapshot.paramMap.get('id'))
      .subscribe(
        data => {
          this.package = data.package;
          console.log(this.package);

          this.loading = false;
        },
        error => {
          this.router.navigate(['/error/']);
        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";
          }, 2500)
        }

      );
  }
  


  ngOnInit() {
    this.view_more_stock = false;
    this.view_more_no_of_press_sheet = false;
    this.view_more_press_sheet = false;
    this.view_more_no_of_ups = false;
    this.getOnePackageSpec();
  }

}
