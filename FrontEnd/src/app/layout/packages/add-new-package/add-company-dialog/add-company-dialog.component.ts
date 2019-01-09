import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PackageInformationService } from '../../../../shared/services/package-information.service'

//services
import { DataService } from '../../../../shared/services/data.service';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {
  addNewCompany: FormGroup;
  close: boolean = true;
  constructor(
    private packageService: PackageInformationService,
    private fb: FormBuilder,
    public dataService: DataService,
  ) { }
  createForm() {
    this.addNewCompany = this.fb.group({
      company_name: [
        '', Validators.required
      ],
      company_address: [
        ''
      ],
      company_telephone: [
        ''
      ]
    })
  }
  data;
  onAddNewCompany() {
    var company_name = this.addNewCompany.get('company_name').value;
    var company_address = this.addNewCompany.get('company_address').value;
    var company_telephone = this.addNewCompany.get('company_telephone').value;

    if (this.addNewCompany.valid) {
      var company = {
        "company_name": company_name.toLowerCase(),
        "company_address": company_address.toLowerCase(),
        "company_telephone": company_telephone.toLowerCase()
      }

      this.packageService.addCompany(company)
        .subscribe(
          data => {
            this.data = data.company;
            this.dataService.changeCompany(data.company);
          },
          err => {
            console.log(err);
          }
        )
    }
  }

  disableAddButton(value: string) {
    this.close = true;
    if (value) {
      this.close = false;
    }
  }
  ngOnInit() {
    this.createForm();
  }

}