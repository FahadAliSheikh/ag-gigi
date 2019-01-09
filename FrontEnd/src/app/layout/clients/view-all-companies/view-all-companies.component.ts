import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

//services 
import { CompanyService } from '../../../shared/services/clients/company.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

//dialoges
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import { EditCompanyDialogComponent } from './edit-company-dialog/edit-company-dialog.component';

@Component({
  selector: 'app-view-all-companies',
  templateUrl: './view-all-companies.component.html',
  styleUrls: ['./view-all-companies.component.scss']
})
export class ViewAllCompaniesComponent implements OnInit {
  message;
  displayedColumns: string[] = ['company_name', 'company_telephone', 'company_address', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = true;
  constructor(
    private companyServices: CompanyService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
    public dialog: MatDialog
  ) { }

  getAllCompanies() {
    this.companyServices.getAllCompanies()
      .subscribe(
        data => {
          this.dataSource = new MatTableDataSource<any>(data.companies);
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

  deleteCompany(id) {
    this.loading = true;
    this.companyServices.deleteCompany(id)
      .subscribe(
        data => {
          this.getAllCompanies();
        },
        err => {
          this.getAllCompanies();
        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";

          }, 2500)
        }
      )
  }


  //dialog
  openAddCompanyDialog() {
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllCompanies();
      }

    });
  }

  openEditCompanyDialog(company_id) {
    const dialogRef = this.dialog.open(EditCompanyDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
      data: { company_id: company_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllCompanies();
      }
    });
  }
  ngOnInit() {
    this.getAllCompanies();

  }

}
