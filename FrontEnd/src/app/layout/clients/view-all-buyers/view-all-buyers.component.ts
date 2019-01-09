import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

//services 
import { BuyerService } from '../../../shared/services/clients/buyer.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

// dialog
 import {AddBuyerDialogComponent} from './add-buyer-dialog/add-buyer-dialog.component';
 import {EditBuyerDialogComponent} from './edit-buyer-dialog/edit-buyer-dialog.component';
@Component({
  selector: 'app-view-all-buyers',
  templateUrl: './view-all-buyers.component.html',
  styleUrls: ['./view-all-buyers.component.scss']
})
export class ViewAllBuyersComponent implements OnInit {
  editForm: boolean = false;
  activatedCompanyId;
  message;
  displayedColumns: string[] = ['buyer_name', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = true;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private buyerService: BuyerService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
    public dialog: MatDialog
  ) { }

  getAllBuyers() {
    this.buyerService.getAllBuyers(this.activatedCompanyId)
      .subscribe(
        data => {
          this.dataSource = new MatTableDataSource<any>(data.buyers);
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
  deleteBuyer(id) {
    this.loading = true;
    this.buyerService.deleteBuyer(id, this.activatedCompanyId)
      .subscribe(
        data => {
          this.getAllBuyers();
        },
        err => {
          this.getAllBuyers();
        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";

          }, 2500)
        }
      )
  }

  openAddBuyerDialog() {
    const dialogRef = this.dialog.open(AddBuyerDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
      data: {company_id : this.activatedCompanyId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllBuyers();
      }

    });
  }
  openEditBuyerDialog(company_id) {
    const dialogRef = this.dialog.open(EditBuyerDialogComponent, {
      width: '50%',
      position: { top: '3%', left: '25%' },
      data: { company_id: company_id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getAllBuyers();
      }
    });
  }


  ngOnInit() {
    this.activatedCompanyId = this.ActivatedRoute.snapshot.paramMap.get('company_id');
    this.getAllBuyers();
  }

}
