import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PackageInformationService } from '../../../../shared/services/package-information.service'

//services
import { DataService } from '../../../../shared/services/data.service';

export interface DialogData {
  name: string;
  company_id: string;
}

@Component({
  selector: 'app-add-buyer-dialog',
  templateUrl: './add-buyer-dialog.component.html',
  styleUrls: ['./add-buyer-dialog.component.scss']
})
export class AddBuyerDialogComponent implements OnInit {
  addNewBuyer: FormGroup;
  close: boolean = true;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageInformationService,
    public dataService: DataService,

    public dialogRef: MatDialogRef<AddBuyerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  createForm() {
    this.addNewBuyer = this.fb.group({
      buyer_name: [
        '', Validators.required
      ]
    })
  }

  onaddNewBuyer() {
    var buyer_name = this.addNewBuyer.get('buyer_name').value;
    if (this.addNewBuyer.valid) {
      var buyer = {
        company_id: this.data.company_id,
        buyer_name: buyer_name.toLowerCase(),
      }

      this.packageService.addBuyer(buyer)
        .subscribe(
          data => {
            console.log(data);
            this.dataService.changeBuyer(data.buyer);

          },
          err => {
            console.log(err)
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
