import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

//services
import { PackageInformationService } from '../../../shared/services/package-information.service';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { CostingService } from '../../../shared/services/costing.service';


// start highlight pipe
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'highlight',
})

export class HighlightPipe implements PipeTransform {

  transform(text: string, search): string {
    if (search && text) {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      pattern = pattern.split(' ').filter((t) => {
        return t.length > 0;
      }).join('|');
      const regex = new RegExp(pattern, 'gi');
      return text.replace(regex, (match) => `<span class="search">${match}</span>`);
    } else {
      return text;
    }
  }
}
// end highlight pipe

export interface Package {
  programme_name: string;
}

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  styleUrls: ['./costing.component.scss']
})


export class CostingComponent implements OnInit {

  calculateCosting: FormGroup;

  loading = false;
  searchedPackages;
  searchedValue;
  selectedPackage
  packageId = '';
  noPackageFound;
  load = false;
  packageIsSelected = false;
  activatedId;
  printingMachines = [];
  dieCuttingMachines = [];
  guillotineCuttingMachines = [];

  constructor(
    private fb: FormBuilder,
    public packageInformationService: PackageInformationService,
    public messageService: MessageService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public errorService: ErrorService,
    public costingService: CostingService,

  ) { }


  //select our package
  selectPackage(event): void {
    this.selectedPackage = event.option.value;
    this.packageId = event.option.value._id;
    this.packageIsSelected = true;
  }


  displayPackage(user?: Package): string | undefined {
    return user ? user.programme_name : undefined;
  }


  createForm() {
    this.calculateCosting = this.fb.group({
      quantity: [
        '0'
      ],
      stock_rate: [
        '0'
      ],
      stock_rate_unit: [

      ],
      delivery_charges: [
        '0'
      ]
    })
  }

  onCalculateCosting() {
    var quantity = this.calculateCosting.get('quantity').value;
    var stock_rate = this.calculateCosting.get('stock_rate').value;
    var stock_rate_unit = this.calculateCosting.get('stock_rate_unit').value;
    var delivery_charges = this.calculateCosting.get('delivery_charges').value;
    console.log(quantity);
    console.log(stock_rate);
    console.log(stock_rate_unit);
    const object = {
      'packageId': this.activatedId,
      'quantity': quantity,
      'stock_rate': stock_rate,
      'stock_rate_unit': stock_rate_unit,
      'delivery_charges': delivery_charges,
    }
    this.costingService.getCostings(object).subscribe(
      data => {
        console.log(data);
      }, err => {
        console.log(err);
      }
    )
  }

  //search packages
  //value;
  // searchPackage() {
  //   this.calculateCosting.get('packageId')
  //     .valueChanges
  //     .pipe(
  //       debounceTime(250))
  //     .subscribe(value => {
  //       if (value == "") {
  //         this.load = false;
  //       }
  //       if (typeof value === 'string' && value != "") {
  //         this.load = true;
  //         this.searchedValue = value;

  //         this.packageInformationService.searchPackages(value)
  //           .subscribe(
  //             data => {
  //               this.load = false;
  //               this.searchedPackages = data.packages;
  //               if (this.searchedPackages.length == 0) {
  //                 this.noPackageFound = true;
  //               } else this.noPackageFound = false;
  //             },
  //             err => {
  //               console.log(err);
  //             }
  //           )
  //       }
  //     })
  // }

  ngOnInit() {
    this.activatedId = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.createForm();
    // this.searchPackage();

  }

}



