import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';


import { PackageInformationService } from '../../../shared/services/package-information.service';
import { MessageService } from '../../../shared/services/message.service';
import { DeleteComformationDialogueComponent } from '../delete-comformation-dialogue/delete-comformation-dialogue.component'
import { UrlService } from '../../../shared/services/url.service';

@Component({
  selector: 'app-view-one-package',
  templateUrl: './view-one-package.component.html',
  styleUrls: ['./view-one-package.component.scss']
})
export class ViewOnePackageComponent implements OnInit {
  package;
  front_coatings;
  back_coatings;
  cut_types;
  pastings;
  special_requirements;
  primary_packings;
  secondary_prints;
  front_process_colors;
  front_spot_colors;
  back_process_colors;
  back_spot_colors;
  variable_colors;
  loading = false;


  constructor(
    private ActivatedRoute: ActivatedRoute,
    public packageInformationService: PackageInformationService,
    private router: Router,
    public messageService: MessageService,
    public urlService: UrlService,
    public dialog: MatDialog

  ) { }

  getOnePackageSpec() {
    this.loading = true;
    this.packageInformationService
      .getOnePackageSpec(this.ActivatedRoute.snapshot.paramMap.get('id'))
      .subscribe(
        data => {
          this.package = data.package;
          console.log(this.package);
          this.front_process_colors = this.package.product.color.front.process_colors;
          this.back_process_colors = this.package.product.color.back.process_colors;
          this.front_spot_colors = this.package.product.color.front.spot_colors;
          this.back_spot_colors = this.package.product.color.back.spot_colors;
          this.variable_colors = this.package.product.color.variable.variable_colors;
          this.front_coatings = this.package.product.coating.front;
          this.back_coatings = this.package.product.coating.back;
          this.cut_types = this.package.product.finishing.cut_type;
          this.pastings = this.package.product.finishing.pasting;
          this.special_requirements = this.package.product.finishing.special_requirements;
          this.primary_packings = this.package.packing.primary_pack;
          this.secondary_prints = this.package.product.finishing.secondary_print;
          // console.log(this.package);
          // console.log(data);
          this.loading = false;
        },
        error => {
          //console.log(error);

          this.router.navigate(['/error/']);

        },
        () => {
          setTimeout(() => {
            this.messageService.successMessage = ""
            this.messageService.errorMessage = "";

          }, 2500)
        }

      );
  }

  deletePackage(id) {
    this.loading = true;
    this.packageInformationService.deletePackageSpec(id).subscribe(
      data => {
        this.router.navigate(['/production/packages/view-all-packages']);
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

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printablearea').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.10/angular-material.css" />
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet">
          <style>
        .avatar{
          border-radius: 0px;
          float: right;
          height: 80px;
          width: 70px;
        }
        #content{
          padding-top: 100px;
        }
        .title{
          display: inline-block;
          font-weight: 600;
          font-size: 50px;
          color: #4f8269;
        }
        table, td, th {    
          text-align: left;
          border: 1px solid #ddd;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
        }
        
        th, td {
          padding: 6px;
        }
        .tabletitle{
          background-color: #4f8269;
          color: white;
        }
        .datafield{
          background-color: #f4f4f4
        }
        .tabletitleCenter{
          background-color: #4f8269;
          color: white;
          text-align: center;
        }
        .datatitlefield{
          background-color: #d8d8d8;
          text-align: left;
        }
        .datatitlefieldcenter{
          background-color: #d8d8d8;
          text-align: center;
        }
        #image{
        display:none;
        }
        #print{
          display:none;
        }
        th{
          color:black !important;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  ngOnInit() {
    this.getOnePackageSpec();

  }

}
