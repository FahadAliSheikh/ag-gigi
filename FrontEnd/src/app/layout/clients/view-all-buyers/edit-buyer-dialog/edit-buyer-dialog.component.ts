import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

//services 
import {BuyerService} from '../../../../shared/services/clients/buyer.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { MessageService } from '../../../../shared/services/message.service';

export interface DialogData {
  company_id: String
}

@Component({
  selector: 'app-edit-buyer-dialog',
  templateUrl: './edit-buyer-dialog.component.html',
  styleUrls: ['./edit-buyer-dialog.component.scss']
})
export class EditBuyerDialogComponent implements OnInit {

  editBuyer: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditBuyerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private buyerServices: BuyerService,
    public errorService: ErrorService,
    public messageService: MessageService,
  ) { }

  createForm() {
    this.editBuyer = this.fb.group({
      buyer_name: [
        '', Validators.required
      ]
    })
  }

  onEditBuyer() {

    var buyer_name = this.editBuyer.get('buyer_name').value;

    if (this.editBuyer.valid) {
      var buyer = {
        "buyer_name": buyer_name.toLowerCase()
      }
      this.buyerServices.editBuyer(this.data.company_id, buyer)
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
  getClickedBuyer(){
    this.buyerServices.getOneBuyer(this.data.company_id)
        .subscribe(
          data => {
            this.editBuyer.get('buyer_name').setValue(data.buyer.buyer_name);
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
    this. getClickedBuyer();
  }

}
