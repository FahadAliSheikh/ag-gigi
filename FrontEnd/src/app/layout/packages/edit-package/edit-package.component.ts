import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//function.ts
import { SearchBar } from './functions';

//chips
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
//dialog
import { AddCompanyDialogComponent } from '../add-new-package/add-company-dialog/add-company-dialog.component';
import { AddBuyerDialogComponent } from '../add-new-package/add-buyer-dialog/add-buyer-dialog.component';
import { AddConcernedPersonDialogComponent } from '../add-new-package/add-concerned-person-dialog/add-concerned-person-dialog.component';

//service 
import { PackageInformationService } from '../../../shared/services/package-information.service';
import { MessageService } from '../../../shared/services/message.service';
import { DataService } from '../../../shared/services/data.service';
import { CostingService } from '../../../shared/services/costing.service';
import { debounceTime } from 'rxjs/operators';

// start highlight pipe
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'highlight',
})

export class HighlightPipe1 implements PipeTransform {

  transform(text: string, search): string {
    if (search && text) {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      pattern = pattern.split(' ').filter((t) => {
        return t.length > 0;
      }).join('|');
      const regex = new RegExp(pattern, 'gi');
      console.log(text);
      console.log(search);
      return text.replace(regex, (match) => `<span class="search">${match}</span>`);
    } else {
      return text;
    }
  }
}
// end highlight pipe

export interface ConcernedPerson {
  _id: string;
  concerned_person: string;
  concerned_person_email: string;
  concerned_person_phone: string;
}
export interface Buyer {
  _id: string;
  buyer_name: string;
  concerned_person;
}
export interface Company {
  _id: string;
  company_name: string;
  company_address: string;
  company_telephone: string;
  buyer;
}

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {
  //form
  fileName;
  selectedFile: File = null;
  addPackageInfo: FormGroup;

  //nomral variables
  package;
  buyerInput;
  activatedId;
  deliverydate;
  companyInput;
 // cartonChecked;
 // palletChecked;
  thicknessUnit;
  concernedInput;
  buyerFiledValue;
  frontCoating;
  backCoating;
  companyFieldValue;
  selectedThreadType;
  concernedFieldValue;

  //strings
  vhint = "";
  fshint = "";
  bshint = "";
  labelPosition = 'after';
  selectedBuyerName: string;
  selectedCompanyName: string;

  //booleans
  visible = true;
  removable = true;
  isLinear = false;
  addOnBlur = false;
  selectable = true;
  pointChecked = true;
  microChecked = false;
  load: boolean = false;
  panelOpenState = false;
  loading: boolean = false;
  punchStatus: boolean = false;
  threadStatus: boolean = false;
  noBuyerFound: boolean = false;
  isBuyerSelected: boolean = true;
  punchRequiredd: boolean = false;
  noCompanyFound: boolean = false;
  isPersonSelected: boolean = true;
  threadRequiredd: boolean = false;
  noConcernedFound: boolean = false;
  isCompanySelected: boolean = true;


  //arrayas
  allCuts = [];
  allSecondryPrints = [];
  pasting = [];
  barCodes = [];
  cutTypes = [];
  stockInfo = [];
  deliveryBy = [];
  allThreads = [];
 // allCartons = [];
 // allPallets = [];
  allFoldings = [];
  allPastings = [];
  allBarCodes = [];
  threadTypes = [];
  allDeliverBys = [];
  packageFormat = [];
  backSpot: any = [];
  variableColors = [];
  allSpecialReqs = [];
  primaryPacking = [];
  frontSpot: any = [];
  allCoatedSides = [];
  buyers: Buyer[] = [];
  allPerforations = [];
  allDescriptions = [];
  productionsArray = [];
  allCoatings = [];
  backProcess: any = [];
  allPackageFormats = [];
  frontProcess: any = [];
  merchandisersArray = [];
  allPrimaryPackings = [];
  companies: Company[] = [];
  concernedPersons: ConcernedPerson[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  processColors: string[] = ['Cyan', 'Magenta', 'Yellow', 'Black'];


  //ends here
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public packageService: PackageInformationService,
    sanitizer: DomSanitizer,
    public messageService: MessageService,
    public dataService: DataService,
    public dropDownService: CostingService,


  ) { }



  //dialog
  openAddCompanyDialog() {
    this.dataService.currentCompanyData
      .subscribe(
        company => {
          var company = company;
          this.companyInput = company._id;
          this.isCompanySelected = true;
          this.addPackageInfo.get('company_name').setValue(company);

        })
    this.companies = [];
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
    });
  }

  openAddBuyerDialog() {
    this.dataService.currentBuyerData
      .subscribe(
        buyer => {
          var buyer = buyer;
          this.buyerInput = buyer._id;
          this.isBuyerSelected = true;
          this.addPackageInfo.get('buyer_name').setValue(buyer);
        }
      )
    this.companies = [];
    const dialogRef = this.dialog.open(AddBuyerDialogComponent, {
      width: '600px',
      position: { top: '80px', left: '500px' },
      data: {
        name: this.selectedCompanyName,
        company_id: this.companyInput
      }
    });
  }
  openAddConcernedPersonDialog() {
    this.dataService.currentConcernedPersonData
      .subscribe(
        concernedPerson => {
          var concernedPerson = concernedPerson;
          this.concernedInput = concernedPerson._id;
          this.addPackageInfo.get('concerned_person').setValue(concernedPerson);
        }
      )
    this.companies = [];
    const dialogRef = this.dialog.open(AddConcernedPersonDialogComponent, {
      width: '600px',
      position: { top: '80px', left: '500px' },
      data: {
        name: this.selectedBuyerName,
        buyer_id: this.buyerInput
      }
    });
  }
  //foriegn Keys Walay functions
  //search companies/buyers/concerned persons

  //searching with late time

  searchCompany() {
    this.addPackageInfo
      .get('company_name')
      .valueChanges
      .pipe(
        debounceTime(250))
      .subscribe(value => {
        if (!value) {
          this.isCompanySelected = false;
          this.isBuyerSelected = false;
          this.isPersonSelected = false;
          this.companies = [];
          this.addPackageInfo.get('buyer_name').setValue('');
          this.addPackageInfo.get('concerned_person').setValue('');
        }
        // this.buyerInput = "";
        // this.concernedInput = "";
        //console.log("value to be searched" + value);
        if (typeof value === 'string' && value != "") {
          this.load = true;
          this.companyFieldValue = value;
          this.packageService.searchCompanies(value)
            .subscribe(
              data => {
                console.log(data);
                this.load = false;
                this.companies = data.companies;
                if (this.companies.length == 0) {
                  this.noCompanyFound = true;
                } else this.noCompanyFound = false;

              },
              err => {
                console.log(err);
              }
            )
        }
      })
  }


  //buyer
  searchBuyers() {
    this.addPackageInfo
      .get('buyer_name')
      .valueChanges
      .pipe(
        debounceTime(250))
      .subscribe(value => {
        if (!value) {
          this.isBuyerSelected = false;
          this.isPersonSelected = false;
          this.buyers = [];
          // this.companyInput = "";
          // this.buyerInput = "";
          // this.concernedInput = "";
          this.addPackageInfo.get('concerned_person').setValue('');

        }
        var search = {
          searchItem: value,
          company_id: this.companyInput,
        }
        if (typeof value === 'string' && value != "") {
          this.load = true;
          this.buyerFiledValue = value;
          this.packageService.searchBuyers(search)
            .subscribe(
              data => {
                this.load = false;
                console.log(data);
                this.buyers = data.buyers;
                if (this.buyers.length == 0) {
                  this.noBuyerFound = true;
                } else this.noBuyerFound = false;
              },
              err => {
                console.log(err);
              }
            )
        }
      })
  }


  //search person
  searchPersons() {
    this.addPackageInfo
      .get('concerned_person')
      .valueChanges
      .pipe(
        debounceTime(300))
      .subscribe(value => {
        if (!value) {
          this.concernedPersons = [];
        }
        var search = {
          searchItem: value,
          buyer_id: this.buyerInput,

        }
        if (typeof value === 'string' && value != "") {
          this.load = true;
          this.concernedFieldValue = value;
          this.packageService.searchConcernedPersons(search)
            .subscribe(
              data => {
                this.load = false;


                this.concernedPersons = data.concernedPersons;
                if (this.concernedPersons.length == 0) {
                  this.noConcernedFound = true;
                } else this.noConcernedFound = false;
              },
              err => {
                console.log(err);
              }
            )
        }
      })
  }


  // displays
  displayCompanies(company: Company) {
    if (company) { return company.company_name; }
  }

  displayBuyers(buyer: Buyer) {
    if (buyer) { return buyer.buyer_name; }
  }

  displayPersons(person: ConcernedPerson) {
    if (person) { return person.concerned_person }
  }

  //company select
  selectedCompany(event): void {
    if (event.option.value) {
      this.companyInput = event.option.value._id;
      console.log(event.option.value._id)
      this.isCompanySelected = true;
      this.selectedCompanyName = event.option.value.company_name;
    }
  }

  //buyer select
  selectedBuyer(event): void {
    if (event.option.value) {
      this.buyerInput = event.option.value._id;
      console.log(this.buyerInput);
      this.isBuyerSelected = true;
      this.isPersonSelected = true;

      this.selectedBuyerName = event.option.value.buyer_name;
    }
  }

  // person select
  selectedConcerned(event): void {
    if (event.option.value)
      this.concernedInput = event.option.value._id;
  }

  // if we change seleced company
  onConpanyChange() {
    //    console.log(this.addPackageInfo.get('buyer'));
    this.isBuyerSelected = false;
    this.isPersonSelected = false;
    this.addPackageInfo.get('buyer_name').setValue('');
    this.addPackageInfo.get('concerned_person').setValue('');

  }

  // if we change seleced buyer
  onBuyerChange() {
    this.isPersonSelected = false;
    this.addPackageInfo.get('concerned_person').setValue('');

  }


  //front process color
  addFPColor(event: MatChipInputEvent): void {
    const value = event.value;
    this.frontProcess = value;
  }
  ////////////////////

  //back process color 
  addBPColor(event: MatChipInputEvent): void {
    const value = event.value;
    this.backProcess = value;
  }
  ////////////////////

  //front spot color
  addFSColor(event: MatChipInputEvent): void {
    var isUnique = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      for (var i = 0; i < this.frontSpot.length; i++) {
        if (input.value.toLowerCase() == this.frontSpot[i].toLowerCase()) {
          this.fshint = "Color Must be unique";
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        this.fshint = "";
        this.frontSpot.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
    this.addPackageInfo.get('front_spot_colors').setValue(null);
  }

  removeFSColor(color): void {
    const index = this.frontSpot.indexOf(color);

    if (index >= 0) {
      this.frontSpot.splice(index, 1);
      this.fshint = "";
    }
  }

  //Back Spot Colors
  addBSColor(event: MatChipInputEvent): void {
    var isUnique = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      for (var i = 0; i < this.backSpot.length; i++) {
        if (input.value.toLowerCase() == this.backSpot[i].toLowerCase()) {
          this.bshint = "Color Must be unique";
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        this.bshint = "";
        this.backSpot.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
    this.addPackageInfo.get('back_spot_colors').setValue(null);
  }

  removeBSColor(color): void {
    const index = this.backSpot.indexOf(color);

    if (index >= 0) {
      this.backSpot.splice(index, 1);
      this.bshint = "";
    }
  }

  //variable color
  addVariableColor(event: MatChipInputEvent): void {
    var isUnique = true;
    const input = event.input;
    const value = event.value;

    // Add our variable color
    if ((value || '').trim()) {
      for (var i = 0; i < this.variableColors.length; i++) {
        if (input.value.toLowerCase() == this.variableColors[i].toLowerCase()) {
          this.vhint = "Color Must be unique";
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        this.vhint = "";
        this.variableColors.push(value.trim());
      }

    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.addPackageInfo.get('variable_colors').setValue(null);
  }

  removeVariableColor(variableColor): void {
    const index = this.variableColors.indexOf(variableColor);

    if (index >= 0) {
      this.variableColors.splice(index, 1);
      this.bshint = "";
    }
  }





  punchRequired(event: any) {
    var value = event.value;
    if (value == 'yes') {
      this.punchStatus = true;
      this.punchRequiredd = true;
    } else if (value == 'no') {
      this.punchStatus = false
      this.punchRequiredd = false;
      this.addPackageInfo.get('punch_diameter').setValue(0);

    }
  }

  onThnicknessUnit(event: any) {
    this.thicknessUnit = event.value;
  }


  threadRequired(event: any) {
    var value = event.value;
    if (value == 'yes') {
      this.threadStatus = true;
      this.threadRequiredd = true;
    } else if (value == 'no') {
      this.threadStatus = false;
      this.threadRequiredd = false;
      const toSelect = this.allThreads.find(found => found.type == 'none');
      console.log(toSelect);
      this.addPackageInfo.get('thread_type').setValue(toSelect);
      this.addPackageInfo.get('thread_length').setValue(0);
    }
  }

  onFileChanged(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.name);
    this.fileName = this.selectedFile.name;

  }

  createForm() {
    this.addPackageInfo = this.fb.group({
      // merchandiser: [
      //   ''
      // ],
      // production: [
      //   ''
      // ],
      programme_id: [
        ''
      ],
      programme_name: [
        ''
      ],
      artwork_code: [
        ''
      ],
      buyer_name: [
        '', Validators.required
      ],
      company_name: [
        '', Validators.required

      ],
      // company_address: [
      //   ''
      // ],
      // company_telephone: [
      //   ''
      // ],
      concerned_person: [
        '', Validators.required
      ],
      // concerned_person_phone: [
      //   ''
      // ],
      // concerned_person_email: [
      //   ''
      // ],

      product_info_unit: [
        ''
      ],
      package_format: [
        ''
      ],
      product_image: [
        ''
      ],
      // quantity: [
      //   ''
      // ],
      flat_length: [
        ''
      ],
      flat_width: [
        ''
      ],
      flat_trim: [
        ''
      ],
      flat_gutter: [
        ''
      ],
      carton_length: [
        ''
      ],
      carton_width: [
        ''
      ],
      carton_height: [
        ''
      ],
      carton_flap: [
        ''
      ],
      carton_zay: [
        ''
      ],

      front_process_colors: [
        ''
      ],
      front_spot_colors: [
        ''
      ],

      back_process_colors: [
        ''
      ],
      back_spot_colors: [
        ''
      ],
      variable_colors: [
        ''
      ],
      imprint: [
        ''
      ],
      barcode: [
        ''
      ],
      front_coating: [
        '',
      ],
      back_coating: [
        '',
      ],
      pasting: [
        ''
      ],
      special_requirements: [
        ''
      ],
      cut_type: [
        ''
      ],
      secondary_print: [
        ''
      ],
      punch_required: [
        ''
      ],
      punch_diameter: [
        ''
      ],
      folding: [
        ''
      ],
      thread_required: [
        ''
      ],
      thread_type: [
        ''
      ],
      thread_length: [
        ''
      ],
      perforation: [
        ''
      ],
      mill_name: [
        ''
      ],
      // grain_direction: [
      //   ''
      // ],
      description: [
        ''
      ],
      coated_sides: [
        ''
      ],
      weight: [
        ''
      ],
      thickness: [
        ''
      ],
      thickness_unit: [
        this.thicknessUnit,
      ],

      bundle: [
        ''
      ],
      primary_pack: [
        ''
      ],
      // carton: [
      //   ''
      // ],
      // pallet: [
      //   ''
      // ],

    })
  }


  onAddPackageInfo() {
    this.loading = true;
    // var merchandiser = this.addPackageInfo.get('merchandiser').value._id;
    // var production = this.addPackageInfo.get('production').value._id;
    var programme_id = this.addPackageInfo.get('programme_id').value;
    var programme_name = this.addPackageInfo.get('programme_name').value;
    var artwork_code = this.addPackageInfo.get('artwork_code').value;

    var buyer_name = this.buyerInput ? this.buyerInput : this.package.buyer._id;
    var company_name = this.companyInput ? this.companyInput : this.package.company._id;
    var concerned_person = this.concernedInput ? this.concernedInput : this.package.concerned_person._id;
    var product_info_unit = this.addPackageInfo.get('product_info_unit').value;
    var package_format = this.addPackageInfo.get('package_format').value._id;
    // var quantity = this.addPackageInfo.get('quantity').value;
    var flat_length = this.addPackageInfo.get('flat_length').value;
    var flat_width = this.addPackageInfo.get('flat_width').value;
    var flat_trim = this.addPackageInfo.get('flat_trim').value;
    var flat_gutter = this.addPackageInfo.get('flat_gutter').value;
    var carton_length = this.addPackageInfo.get('carton_length').value;
    var carton_width = this.addPackageInfo.get('carton_width').value;
    var carton_height = this.addPackageInfo.get('carton_height').value;
    var carton_flap = this.addPackageInfo.get('carton_flap').value;
    var carton_zay = this.addPackageInfo.get('carton_zay').value;

    var imprint = this.addPackageInfo.get('imprint').value;
    var barcode = this.addPackageInfo.get('barcode').value._id;

    var front_coating = this.addPackageInfo.get('front_coating').value;
    var back_coating = this.addPackageInfo.get('back_coating').value;
    var pasting = this.addPackageInfo.get('pasting').value;
    var special_requirements = this.addPackageInfo.get('special_requirements').value;
    var cut_type = this.addPackageInfo.get('cut_type').value;
    var secondary_print = this.addPackageInfo.get('secondary_print').value;
    var punch_required = this.addPackageInfo.get('punch_required').value;

    var punch_diameter = this.addPackageInfo.get('punch_diameter').value;
    var folding = this.addPackageInfo.get('folding').value._id;
    var thread_required = this.addPackageInfo.get('thread_required').value;
    var thread_type = this.addPackageInfo.get('thread_type').value._id;
    var thread_length = this.addPackageInfo.get('thread_length').value;
    var perforation = this.addPackageInfo.get('perforation').value._id;
    var mill_name = this.addPackageInfo.get('mill_name').value;
    //var grain_direction = this.addPackageInfo.get('grain_direction').value;
    var description = this.addPackageInfo.get('description').value._id;
    var coated_sides = this.addPackageInfo.get('coated_sides').value._id;
    var weight = this.addPackageInfo.get('weight').value;
    var thickness = this.addPackageInfo.get('thickness').value;
    this.buyerInput ? this.buyerInput : this.package.buyer._id;
    var thickness_unit = this.addPackageInfo.get('thickness_unit').value ?
      this.addPackageInfo.get('thickness_unit').value : this.package.stock.stock_thickness_unit;
    // var stock_length = this.addPackageInfo.get('stock_length').value;
    // var stock_width = this.addPackageInfo.get('stock_width').value;
    var bundle = this.addPackageInfo.get('bundle').value;
    var primary_pack = this.addPackageInfo.get('primary_pack').value;
    // var carton = this.addPackageInfo.get('carton').value;
    // var pallet = this.addPackageInfo.get('pallet').value;
    // var location = this.addPackageInfo.get('location').value;
    // var delivery_date = this.addPackageInfo.get('delivery_date').value;
    // var delivered_by = this.addPackageInfo.get('delivered_by').value._id;

    var fd = new FormData();

    // fd.append('merchandiser', merchandiser);
    // fd.append('production', production);
    fd.append('programme_id', programme_id);
    fd.append('programme_name', programme_name);
    fd.append('artwork_code', artwork_code);
    fd.append('buyer_name', buyer_name);
    fd.append('company_name', company_name);
    fd.append('concerned_person', concerned_person);
    //fd.append('product_info_unit',product_info_unit );
    fd.append('package_format', package_format);
    //  fd.append('quantity', quantity);
    fd.append('flat_length', flat_length);
    fd.append('flat_width', flat_width);
    fd.append('flat_trim', flat_trim);
    fd.append('flat_gutter', flat_gutter);
    fd.append('carton_length', carton_length);
    fd.append('carton_width', carton_width);
    fd.append('carton_height', carton_height);
    fd.append('carton_flap', carton_flap);
    fd.append('carton_zay', carton_zay);
    fd.append('imprint', imprint);
    fd.append('barcode', barcode);

    fd.append('front_coating', JSON.stringify(front_coating));
    fd.append('back_coating', JSON.stringify(back_coating));
    fd.append('pasting', JSON.stringify(pasting));
    fd.append('special_requirements', JSON.stringify(special_requirements));
    fd.append('cut_type', JSON.stringify(cut_type));
    fd.append('secondary_print', JSON.stringify(secondary_print));

    fd.append('punch_required', punch_required);
    fd.append('punch_diameter', punch_diameter);
    fd.append('folding', folding);
    fd.append('thread_required', thread_required);
    fd.append('thread_type', thread_type);
    fd.append('thread_length', thread_length);
    fd.append('perforation', perforation);
    fd.append('mill_name', mill_name);
    //  fd.append('grain_direction', grain_direction);
    fd.append('description', description);
    fd.append('coated_sides', coated_sides);
    fd.append('stock_weight', weight);
    fd.append('stock_thickness', thickness);
    fd.append('stock_thickness_unit', thickness_unit);
    //  fd.append('stock_length', stock_length);
    //  fd.append('stock_width', stock_width);
    fd.append('bundle', bundle);
    fd.append('primary_pack', JSON.stringify(primary_pack));
    // fd.append('carton', carton);
    // fd.append('pallet', pallet);
    //  fd.append('location', location);
    // fd.append('delivery_date', delivery_date);
    //  fd.append('delivered_by', delivered_by);
    fd.append('front_process_colors', JSON.stringify(this.frontProcess));
    fd.append('front_spot_colors', JSON.stringify(this.frontSpot));
    fd.append('back_process_colors', JSON.stringify(this.backProcess));
    fd.append('back_spot_colors', JSON.stringify(this.backSpot));
    fd.append('variable_colors', JSON.stringify(this.variableColors));
    if (this.selectedFile) fd.append('product_image', this.selectedFile, this.selectedFile.name);

    this.packageService.editPackageSpec(fd, this.activatedId).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/production/packages/view-one-package/' + this.activatedId]);
      },
      err => {
        console.log(err);
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


  // getMerchandiser(merchandiser) {
  //   this.packageService.getAllMerchandisers()
  //     .subscribe(
  //       data => {
  //         this.merchandisersArray = data.merchandisers;
  //         const toSelect = this.merchandisersArray.find(found => found._id == merchandiser._id);
  //         this.addPackageInfo.get('merchandiser').setValue(toSelect)
  //       }
  //     )
  // }


  // getProductions(production) {
  //   this.packageService.getAllProductions()
  //     .subscribe(
  //       data => {
  //         this.productionsArray = data.productions;
  //         const toSelect = this.productionsArray.find(found => found._id == production._id);
  //         this.addPackageInfo.get('production').setValue(toSelect)
  //       }
  //     )
  // }

  /// get all dropdowns from database
  //get package formats
  getAllPackageFormats(format) {
    this.dropDownService.getAllPackageFormats()
      .subscribe(
        data => {
          this.allPackageFormats = data.packageFormats;
          const toSelect = this.allPackageFormats.find(found => found._id == format._id);
          this.addPackageInfo.get('package_format').setValue(toSelect)

        }, err => {
          console.log(err)
        }
      )
  }

  //get coatings
  getAllCoatings(frontCoatins, backCoatings) {

    this.dropDownService.getAllCoatings()
      .subscribe(
        data => {
          this.allCoatings = data.coatings;
          console.log(this.allCoatings);
          var frontSelect = [];
          var backSelect = [];
          frontCoatins.forEach(frontCoating => {
            frontSelect.push(frontCoating._id);
          })
          backCoatings.forEach(backCoating => {
            backSelect.push(backCoating._id);
          })
          console.log(frontSelect);
          this.addPackageInfo.get('front_coating').setValue(frontSelect);
          this.addPackageInfo.get('back_coating').setValue(backSelect);

        }
      )
  }


  //get barcodes
  getAllBarCodes(selectedBarcode) {
    this.dropDownService.getAllBarCodes()
      .subscribe(
        data => {
          this.allBarCodes = data.barCodes;
          const toSelect = this.allBarCodes.find(found => found._id == selectedBarcode._id);
          this.addPackageInfo.get('barcode').setValue(toSelect);
        }
      )
  }
  //get cuts
  getAllCuts(selectedCuts) {
    this.dropDownService.getAllCuts()
      .subscribe(
        data => {
          this.allCuts = data.cuts;
          var toSelectCuts = [];
          selectedCuts.forEach(selectedCut => {
            toSelectCuts.push(selectedCut._id);
          })
          this.addPackageInfo.get('cut_type').setValue(toSelectCuts);
        }, err => {
          console.log(err)
        }
      )
  }
  //get secondary priints
  getSecondaryPrints(selecedPrints) {
    this.dropDownService.getSecondaryPrints()
      .subscribe(
        data => {
          this.allSecondryPrints = data.secondaryPrints;
          var toSelectPrints = [];
          selecedPrints.forEach(selectedPrint => {
            toSelectPrints.push(selectedPrint._id);
          })

          this.addPackageInfo.get('secondary_print').setValue(toSelectPrints);

        }
      )
  }
  //get all threads
  getAllThreads(selectedThread) {
    this.dropDownService.getAllThreads()
      .subscribe(
        data => {
          // console.log(data);
          this.allThreads = data.threads;
          const toSelect = this.allThreads.find(found => found._id == selectedThread._id);
          this.addPackageInfo.get('thread_type').setValue(toSelect);
        }, err => {
          console.log(err)
        }
      )
  }

  //get all pastings
  getAllPastings(pasting) {
    this.dropDownService.getAllPastings()
      .subscribe(
        data => {
          // console.log(data);
          this.allPastings = data.pastings;
          var toSelectPastings = [];
          pasting.forEach(past => {
            toSelectPastings.push(past._id);
          })
          this.addPackageInfo.get('pasting').setValue(toSelectPastings);

        }, err => {
          console.log(err)
        }
      )
  }

  //getAllSpecialReqs
  getAllSpecialReqs(special_requirements) {
    this.dropDownService.getAllSpecialReqs()
      .subscribe(
        data => {
          // console.log(data);
          this.allSpecialReqs = data.special_requirements;
          var toSelectSpecialReq = [];
          special_requirements.forEach(special => {
            toSelectSpecialReq.push(special._id);
          })
          this.addPackageInfo.get('special_requirements').setValue(toSelectSpecialReq);
        }, err => {
          console.log(err)
        }
      )
  }

  //getAllFoldings
  getAllFoldings(folding) {
    this.dropDownService.getAllFoldings()
      .subscribe(
        data => {
          // console.log(data);
          this.allFoldings = data.foldings;
          const toSelect = this.allFoldings.find(found => found._id == folding._id);
          this.addPackageInfo.get('folding').setValue(toSelect);

        }, err => {
          console.log(err)
        }
      )
  }

  //getAllPerforations
  getAllPerforations(perforation) {
    this.dropDownService.getAllPerforations()
      .subscribe(
        data => {
          // console.log(data);

          this.allPerforations = data.perforations;
          const toSelect = this.allPerforations.find(found => found._id == perforation._id);
          this.addPackageInfo.get('perforation').setValue(toSelect);

        }, err => {
          console.log(err)
        }
      )
  }

  //getAllDescriptions
  getAllDescriptions(description) {
    this.dropDownService.getAllDescriptions()
      .subscribe(
        data => {
          // console.log(data);
          this.allDescriptions = data.descriptions;
          const toSelect = this.allDescriptions.find(found => found._id == description._id);
          this.addPackageInfo.get('description').setValue(toSelect);

        }, err => {
          console.log(err)
        }
      )
  }

  //getAllCoatedSides
  getAllCoatedSides(coatedSides) {
    this.dropDownService.getAllCoatedSides()
      .subscribe(
        data => {
          // console.log(data);
          this.allCoatedSides = data.coatedSides;
          const toSelect = this.allCoatedSides.find(found => found._id == coatedSides._id);
          this.addPackageInfo.get('coated_sides').setValue(toSelect);

        }, err => {
          console.log(err)
        }
      )
  }

  //getAllPrimaryPackings
  getAllPrimaryPackings(selected_primary_pack) {
    this.dropDownService.getAllPrimaryPackings()
      .subscribe(
        data => {
          // console.log(data);
          this.allPrimaryPackings = data.primaryPackings;
          var toSelectPrimaryPack = [];
          selected_primary_pack.forEach(prim => {
            toSelectPrimaryPack.push(prim._id);
          })
          this.addPackageInfo.get('primary_pack').setValue(toSelectPrimaryPack);

        }, err => {
          console.log(err)
        }
      )
  }
  //getAlldeliverby
  getAllDeliverBys(delivered_by) {
    this.dropDownService.getAllDeliverBys()
      .subscribe(
        data => {
          console.log(data);
          this.allDeliverBys = data.deliverbys;
          const toSelect = this.allDeliverBys.find(found => found.type == delivered_by.type);
          this.addPackageInfo.get('delivered_by').setValue(toSelect);
        }, err => {
          console.log(err)
        }
      )
  }

  //getAllCartons
  // getAllCartons(carton) {
  //   this.dropDownService.getAllCartons()
  //     .subscribe(
  //       data => {
  //         // console.log(data);
  //         this.allCartons = data.cartons;
  //         const toSelect = this.allCartons.find(found => found._id == carton._id);
  //         this.addPackageInfo.get('carton').setValue(toSelect);

  //       }, err => {
  //         console.log(err)
  //       }
  //     )
  // }
  //getAllPallets
  // getAllPallets(pallet) {
  //   this.dropDownService.getAllPallets()
  //     .subscribe(
  //       data => {
  //         // console.log(data);
  //         this.allPallets = data.pallets;
  //         const toSelect = this.allPallets.find(found => found._id == pallet._id);
  //         this.addPackageInfo.get('pallet').setValue(toSelect);

  //       }, err => {
  //         console.log(err)
  //       }
  //     )
  // }

  ngAfterContentInit() {
    this.getOnePackageSpec();
  }


  ngOnInit() {
    this.activatedId = this.ActivatedRoute.snapshot.paramMap.get('id')
    this.createForm();
    this.searchCompany();
    this.searchBuyers();
    this.searchPersons();
  }

  // --------------------------- Filter functions ------------------------------ //

  displayConcernedPerson(user?: ConcernedPerson): string | undefined {
    return user ? user.concerned_person : undefined;
  }

  displayBuyer(user?: Buyer): string | undefined {
    return user ? user.buyer_name : undefined;
  }

  displayCompany(user?: Company): string | undefined {
    return user ? user.company_name : undefined;
  }

  // dateFilter = (d: Date): boolean => {
  //   const date = new Date();
  //   date.setHours(d.getHours());
  //   date.setMinutes(d.getMinutes());
  //   date.setSeconds(d.getSeconds());
  //   date.setMilliseconds(d.getMilliseconds());
  //   return d.getDay() !== 0 && d.getTime() >= date.getTime();
  // }




  //code which is different than add new 

  getOnePackageSpec() {
    this.loading = true;
    this.packageService
      .getOnePackageSpec(this.activatedId)
      .subscribe(

        data => {
          this.package = data.package;
          //  this.getMerchandiser(this.package.merchandiser);
          //  this.getProductions(this.package.production);
          this.getAllPackageFormats(this.package.product.package_format);
          this.getAllCoatings(this.package.product.coating.front, this.package.product.coating.back);
          this.getAllBarCodes(this.package.product.barcode);
          this.getAllCuts(this.package.product.finishing.cut_type);
          this.getSecondaryPrints(this.package.product.finishing.secondary_print);
          this.getAllThreads(this.package.product.finishing.thread_type);
          this.getAllPastings(this.package.product.finishing.pasting);
          this.getAllSpecialReqs(this.package.product.finishing.special_requirements);
          this.getAllFoldings(this.package.product.finishing.folding);
          this.getAllPerforations(this.package.product.finishing.perforation);
          this.getAllDescriptions(this.package.stock.description);
          this.getAllCoatedSides(this.package.stock.coated_sides);
          this.getAllPrimaryPackings(this.package.packing.primary_pack);
          //this.getAllDeliverBys(this.package.delivery.delivered_by);
          console.log(this.package);


          if (this.package.product.finishing.thread_required == "yes") {
            this.threadStatus = true;
            this.threadRequiredd = true;
          }
          if (this.package.product.finishing.punch_required == 'yes') {
            this.punchStatus = true;
            this.punchRequiredd = true;
          }

          this.addPackageInfo.get('programme_id').setValue(this.package.programme_id);
          this.addPackageInfo.get('programme_name').setValue(this.package.programme_name);
          this.addPackageInfo.get('artwork_code').setValue(this.package.artwork_code);
          this.companyInput = this.package.company._id;
          this.buyerInput = this.package.buyer._id;
          this.concernedInput = this.package.concerned_person._id;
          this.addPackageInfo.get('company_name').setValue(this.package.company);
          this.addPackageInfo.get('buyer_name').setValue(this.package.buyer);
          this.addPackageInfo.get('concerned_person').setValue(this.package.concerned_person);
          //  this.addPackageInfo.get('quantity').setValue(this.package.product.quantity);
          this.addPackageInfo.get('flat_length').setValue(this.package.product.flat.flat_length);
          this.addPackageInfo.get('flat_width').setValue(this.package.product.flat.flat_width);
          this.addPackageInfo.get('flat_trim').setValue(this.package.product.flat.flat_trim);
          this.addPackageInfo.get('flat_gutter').setValue(this.package.product.flat.flat_gutter);
          this.addPackageInfo.get('carton_length').setValue(this.package.product.carton.carton_length);
          this.addPackageInfo.get('carton_width').setValue(this.package.product.carton.carton_width);
          this.addPackageInfo.get('carton_height').setValue(this.package.product.carton.carton_height);
          this.addPackageInfo.get('carton_flap').setValue(this.package.product.carton.carton_flap);
          this.addPackageInfo.get('carton_zay').setValue(this.package.product.carton.carton_zay);
          this.addPackageInfo.get('front_process_colors').setValue(this.package.product.color.front.process_colors);
          this.addPackageInfo.get('back_process_colors').setValue(this.package.product.color.back.process_colors);
          this.addPackageInfo.get('imprint').setValue(this.package.product.imprint);
          this.addPackageInfo.get('punch_required').setValue(this.package.product.finishing.punch_required);
          this.addPackageInfo.get('punch_diameter').setValue(this.package.product.finishing.punch_diameter);
          this.addPackageInfo.get('thread_required').setValue(this.package.product.finishing.thread_required);
          this.addPackageInfo.get('thread_length').setValue(this.package.product.finishing.thread_length);
          this.addPackageInfo.get('mill_name').setValue(this.package.stock.mill_name);
          //  this.addPackageInfo.get('grain_direction').setValue(this.package.stock.grain_direction);
          this.addPackageInfo.get('weight').setValue(this.package.stock.weight);
          this.addPackageInfo.get('thickness').setValue(this.package.stock.thickness);
          // this.addPackageInfo.get('stock_thickness_unit').setValue(this.package.stock.stock_thickness_unit);
          // this.addPackageInfo.get('stock_length').setValue(this.package.stock.stock_length);
          //  this.addPackageInfo.get('stock_width').setValue(this.package.stock.stock_width);
          this.addPackageInfo.get('bundle').setValue(this.package.packing.bundle);
          // this.addPackageInfo.get('carton').setValue(this.package.packing.carton);
          // this.addPackageInfo.get('pallet').setValue(this.package.packing.pallet);
          //  this.addPackageInfo.get('location').setValue(this.package.delivery.location);
          //  this.addPackageInfo.get('delivered_by').setValue(this.package.delivery.delivered_by);
          // if (this.package.delivery.date) {
          //   this.deliverydate = new Date(this.package.delivery.date);
          //   this.addPackageInfo.get('delivery_date').setValue(this.deliverydate);
          // }
          this.variableColors = this.package.product.color.variable.variable_colors;
          this.frontProcess = this.package.product.color.front.process_colors;
          this.frontSpot = this.package.product.color.front.spot_colors;
          this.backProcess = this.package.product.color.back.process_colors;
          this.backSpot = this.package.product.color.back.spot_colors;
          //this.addPackageInfo.get('front').setValue(this.variableColors);

          //radio button
          this.thicknessUnit = this.package.stock.stock_thickness_unit;
          if (this.thicknessUnit == 'point') {
            this.pointChecked = true;
            this.microChecked = false;
          }
          else if (this.thicknessUnit == 'micro') {
            this.pointChecked = false;
            this.microChecked = true;
          }
          //checkbox
          // if (this.package.packing.carton == "true") {
          //   this.cartonChecked = true
          // } else { this.cartonChecked = false; }
          // if (this.package.packing.pallet == "true") {
          //   this.palletChecked = true
          // } else { this.palletChecked = false }
          //imagefilename
          this.fileName = this.package.product.product_image;
          this.loading = false;
        },
        error => {
          console.log(error);
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

  //diiferent code ends here

}
