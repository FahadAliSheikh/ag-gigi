import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

//services 
import {ConcernedPersonService} from '../../../../shared/services/clients/concerned-person.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { MessageService } from '../../../../shared/services/message.service';

export interface DialogData {
  company_id: String
}

@Component({
  selector: 'app-edit-concerned-person-dialog',
  templateUrl: './edit-concerned-person-dialog.component.html',
  styleUrls: ['./edit-concerned-person-dialog.component.scss']
})
export class EditConcernedPersonDialogComponent implements OnInit {
  editPerson: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditConcernedPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private personService: ConcernedPersonService,
    public errorService: ErrorService,
    public messageService: MessageService,
  ) { }

  createForm() {
    this.editPerson = this.fb.group({
      concerned_person: [
        '', Validators.required
      ],
      concerned_person_phone: [
        ''
      ],
      concerned_person_email: [
        ''
      ]
    })
  }

  onEditPerson() {
    var concerned_person = this.editPerson.get('concerned_person').value;
    var concerned_person_phone = this.editPerson.get('concerned_person_phone').value;
    var concerned_person_email = this.editPerson.get('concerned_person_email').value;

    if (this.editPerson.valid) {
      var person = {
        "concerned_person": concerned_person.toLowerCase(),
        "concerned_person_phone": concerned_person_phone.toLowerCase(),
        "concerned_person_email": concerned_person_email.toLowerCase()
      }
      this.personService.editPerson(this.data.company_id, person)
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
  getClickedPerson(){
    this.personService.getOnePerson(this.data.company_id)
        .subscribe(
          data => {
            console.log(data);
            this.editPerson.get('concerned_person').setValue(data.concernedPerson.concerned_person);
            this.editPerson.get('concerned_person_phone').setValue(data.concernedPerson.concerned_person_phone);
            this.editPerson.get('concerned_person_email').setValue(data.concernedPerson.concerned_person_email);
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
    this. getClickedPerson();
  }


}
