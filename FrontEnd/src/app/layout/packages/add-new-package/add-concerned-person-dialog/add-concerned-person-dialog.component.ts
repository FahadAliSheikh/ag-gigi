import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PackageInformationService } from '../../../../shared/services/package-information.service'

//services
import { DataService } from '../../../../shared/services/data.service';

export interface DialogData {
  name: string;
  buyer_id: string
}

@Component({
  selector: 'app-add-concerned-person-dialog',
  templateUrl: './add-concerned-person-dialog.component.html',
  styleUrls: ['./add-concerned-person-dialog.component.scss']
})
export class AddConcernedPersonDialogComponent implements OnInit {
  addNewConcernedPerson: FormGroup;
  close: boolean = true;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageInformationService,
    public dataService: DataService,


    public dialogRef: MatDialogRef<AddConcernedPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  createForm() {
    this.addNewConcernedPerson = this.fb.group({
      concerned_person: [
        '', Validators.required
      ],
      concerned_person_email: [
        ''
      ],
      concerned_person_phone: [
        ''
      ],

    })
  }
  onaddNewConcernedPerson() {
    var concerned_person = this.addNewConcernedPerson.get('concerned_person').value;
    var concerned_person_phone = this.addNewConcernedPerson.get('concerned_person_phone').value;
    var concerned_person_email = this.addNewConcernedPerson.get('concerned_person_email').value;
    var fd = new FormData();

    if (this.addNewConcernedPerson.valid) {
      var concerned = {
        "buyer_id": this.data.buyer_id,
        "concerned_person": concerned_person.toLowerCase(),
        "concerned_person_phone": concerned_person_phone.toLowerCase(),
        "concerned_person_email": concerned_person_email.toLowerCase(),
      }

      this.packageService.addConcerned(concerned)
        .subscribe(
          data => {
            console.log(data);
            this.dataService.changeConcernedPerson(data.concerned);

          },
          err => {
            console.log(err);
          }
        )
      this.close = true;
    } else console.log('concerned person name is required');
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
