import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

//services 
import { CompanyService } from '../../../../shared/services/clients/company.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { MessageService } from '../../../../shared/services/message.service';

export interface DialogData {
  company_id: String
}

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
  styleUrls: ['./edit-company-dialog.component.scss']
})
export class EditCompanyDialogComponent implements OnInit {
  editCompany: FormGroup;
  
  constructor(

    public dialogRef: MatDialogRef<EditCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private companyServices: CompanyService,
    public errorService: ErrorService,
    public messageService: MessageService,

  ) { }



  createForm() {
    this.editCompany = this.fb.group({
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

  //edit buyer
  onEditCompany() {
  

    var company_name = this.editCompany.get('company_name').value;
    var company_address = this.editCompany.get('company_address').value;
    var company_telephone = this.editCompany.get('company_telephone').value;

    if (this.editCompany.valid) {
      var company = {
        "company_name": company_name.toLowerCase(),
        "company_address": company_address.toLowerCase(),
        "company_telephone": company_telephone.toLowerCase()
      }
      this.companyServices.editCompany(this.data.company_id, company)
        .subscribe(
          data => {
          },
          err => {
            console.log(err);
          },
          () => {
            setTimeout(() => {
              this.messageService.successMessage = ""
              this.messageService.errorMessage = "";
            }, 2500)
          }
        )
    }
  }

  getClickedCompany(){
  this.companyServices.getOneCompany(this.data.company_id)
      .subscribe(
        data => {
          this.editCompany.get('company_name').setValue(data.company.company_name);
          this.editCompany.get('company_address').setValue(data.company.company_address);
          this.editCompany.get('company_telephone').setValue(data.company.company_telephone);
        },
        err => {
          console.log(err);
        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";
          }, 2500)
        }
      )
  }

  ngOnInit() {
    this.createForm();
    this. getClickedCompany();
  }

}
