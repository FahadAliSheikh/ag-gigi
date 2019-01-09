import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';

import {PackageInformationService} from '../../../shared/services/package-information.service'
import { Router } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';

export interface PeriodicElement {
  programme_id: string;
  programme_name: number;
  company_name: number;
  buyer_name: string;
  costs: Object
}

@Component({
  selector: 'app-view-all-costing',
  templateUrl: './view-all-costing.component.html',
  styleUrls: ['./view-all-costing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ViewAllCostingComponent implements OnInit {
  columnsToDisplay = ['programme_id', 'programme_name', 'company_name', "buyer_name", "create"];
  expandedElement: PeriodicElement | null;
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean = true;


  constructor(
    public packageInformationService: PackageInformationService,
    private router: Router,
    public errorService: ErrorService,
    public messageService: MessageService,
  ) { }


  getPackageSpec() {
    this.packageInformationService.getPackageSpec().subscribe(
      data => {
        console.log(data.package);
        this.dataSource = new MatTableDataSource<any>(data.package);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 2000);

        this.dataSource.filterPredicate = (data, filter: string)  => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

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
  
   nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  ngOnInit() {
    this.getPackageSpec();
  }

}
