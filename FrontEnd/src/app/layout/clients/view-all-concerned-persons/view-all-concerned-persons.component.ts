import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

//services 
import { ConcernedPersonService } from '../../../shared/services/clients/concerned-person.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

//dialoges
import {AddConcernedPersonDialogComponent} from './add-concerned-person-dialog/add-concerned-person-dialog.component';
import {EditConcernedPersonDialogComponent} from './edit-concerned-person-dialog/edit-concerned-person-dialog.component';
@Component({
  selector: 'app-view-all-concerned-persons',
  templateUrl: './view-all-concerned-persons.component.html',
  styleUrls: ['./view-all-concerned-persons.component.scss']
})
export class ViewAllConcernedPersonsComponent implements OnInit {
  activatedBuyerId;
  message;
  editForm: boolean = false;
  displayedColumns: string[] = ['concerned_person', 'concerned_person_email', 'concerned_person_phone', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = true;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private personService: ConcernedPersonService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
    public dialog: MatDialog
  ) { }

  getAllPersons() {
    this.personService.getAllPersons(this.activatedBuyerId)
      .subscribe(
        data => {
          this.dataSource = new MatTableDataSource<any>(data.concernedPersons);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 2000);

          this.loading = false;

        },
        err => {
          console.log(err);
          this.errorService.error = err.message;
          this.errorService.status = err.status;
          this.router.navigate(['/error/']);

        }
      )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //delete buyer
  deletePerson(id) {
    this.loading = true;
    this.personService.deletePerson(id, this.activatedBuyerId)
      .subscribe(
        data => {
          this.getAllPersons();
        },
        err => {
          this.getAllPersons();
        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";

          }, 2500)
        }
      )
  }
  openAddConcernedPersonDialog() {
    const dialogRef = this.dialog.open(AddConcernedPersonDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
      data: {buyer_id: this.activatedBuyerId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllPersons();
      }

    });
  }

  openEditBuyerDialog(company_id) {
    const dialogRef = this.dialog.open(EditConcernedPersonDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
      data: { company_id: company_id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllPersons();
      }
    });
  }

  ngOnInit() {
    this.activatedBuyerId = this.ActivatedRoute.snapshot.paramMap.get('buyer_id');
    this.getAllPersons();
  }

}
