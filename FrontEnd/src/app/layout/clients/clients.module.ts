import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { ClientsRoutingModule } from './clients-routing.module';
import { ViewAllCompaniesComponent } from './view-all-companies/view-all-companies.component';

// material
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';


import { AddCompanyDialogComponent } from './view-all-companies/add-company-dialog/add-company-dialog.component';
import{AddBuyerDialogComponent} from './view-all-buyers/add-buyer-dialog/add-buyer-dialog.component';
import{AddConcernedPersonDialogComponent} from './view-all-concerned-persons/add-concerned-person-dialog/add-concerned-person-dialog.component';
import { EditCompanyDialogComponent } from './view-all-companies/edit-company-dialog/edit-company-dialog.component';
import { EditBuyerDialogComponent } from './view-all-buyers/edit-buyer-dialog/edit-buyer-dialog.component';
import { EditConcernedPersonDialogComponent } from './view-all-concerned-persons/edit-concerned-person-dialog/edit-concerned-person-dialog.component';

import { ViewAllBuyersComponent } from './view-all-buyers/view-all-buyers.component';
import { ViewAllConcernedPersonsComponent } from './view-all-concerned-persons/view-all-concerned-persons.component';
import { ClientComponent } from './client.component';



@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [
    AddCompanyDialogComponent,
    EditCompanyDialogComponent,
    AddBuyerDialogComponent,
    EditBuyerDialogComponent,
    AddConcernedPersonDialogComponent,
    EditConcernedPersonDialogComponent,
    
  ],
  declarations: [
    AddCompanyDialogComponent,
    AddBuyerDialogComponent,
    AddConcernedPersonDialogComponent,
    EditCompanyDialogComponent,
    EditBuyerDialogComponent,
    EditConcernedPersonDialogComponent,
    EditBuyerDialogComponent,
    ViewAllCompaniesComponent,
    ViewAllBuyersComponent,
    ViewAllConcernedPersonsComponent,
    ClientComponent,
    ]
})
export class ClientsModule { }
