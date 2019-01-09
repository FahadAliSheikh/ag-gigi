import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';

import { PackageInformationService } from '../../../shared/services/package-information.service';
import{DeleteComformationDialogueComponent} from '../delete-comformation-dialogue/delete-comformation-dialogue.component'


//import { IncomingPackage } from '../../../incoming_package_schema';
import { Router } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-view-all-packages',
  templateUrl: './view-all-packages.component.html',
  styleUrls: ['./view-all-packages.component.scss']
})
export class ViewAllPackagesComponent implements OnInit {

  displayedColumns: string[] = ['programme_id', 'programme_name', 'company_name', 'buyer_name', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = true;
  constructor(
    public packageInformationService: PackageInformationService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
    public dialog: MatDialog

  ) { }

  getPackageSpec() {
    this.packageInformationService.getPackageSpec().subscribe(
      data => {
        this.dataSource = new MatTableDataSource<any>(data.package);
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
    );
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePackage(id) {
    this.loading = true;
    this.packageInformationService.deletePackageSpec(id).subscribe(
      data => {
        this.getPackageSpec();
      },
      err => {
        this.getPackageSpec();
      },
      () => {
        setTimeout(() => {
          this.messageService.successMessage = ""
          this.messageService.errorMessage = "";

        }, 2500)
      }
    );
  }

  openDeleteConformationDialog(package_id) {
    const dialogRef = this.dialog.open(DeleteComformationDialogueComponent, {
      width: '40%',
      position: { top: '10%', left: '30%' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.loading = true;
        this.deletePackage(package_id);
      }

    });
  }

  ngOnInit() {
    this.getPackageSpec();
  }

}

