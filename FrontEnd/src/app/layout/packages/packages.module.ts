import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { FilterPipeModule } from 'ngx-filter-pipe';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//services 
import { AuthService } from '../../shared/services/auth.service';
import { PackageInformationService } from '../../shared/services/package-information.service';
//components
import { PackagesRoutingModule } from './packages-routing.module';
import { ViewAllPackagesComponent } from './view-all-packages/view-all-packages.component';
import { ViewOnePackageComponent } from './view-one-package/view-one-package.component';
import { AddNewPackageComponent } from './add-new-package/add-new-package.component';
import { AddCompanyDialogComponent } from './add-new-package/add-company-dialog/add-company-dialog.component';
import { AddBuyerDialogComponent } from './add-new-package/add-buyer-dialog/add-buyer-dialog.component';
import { AddConcernedPersonDialogComponent } from './add-new-package/add-concerned-person-dialog/add-concerned-person-dialog.component';
import { DeleteComformationDialogueComponent } from './delete-comformation-dialogue/delete-comformation-dialogue.component';

import {HighlightPipe} from './add-new-package/add-new-package.component'
import {HighlightPipe1} from './edit-package/edit-package.component'
import { EditPackageComponent } from './edit-package/edit-package.component';
//Material
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    PackagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    //Material
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    MatListModule
  ],
  entryComponents: [
    DeleteComformationDialogueComponent,
    AddNewPackageComponent,
    AddCompanyDialogComponent,
    AddBuyerDialogComponent,
    AddConcernedPersonDialogComponent,

  ],

  declarations: [
    ViewOnePackageComponent,
    ViewAllPackagesComponent,
    DeleteComformationDialogueComponent,
    AddNewPackageComponent,
    EditPackageComponent,
    AddCompanyDialogComponent,
    AddBuyerDialogComponent,
    AddConcernedPersonDialogComponent,
    HighlightPipe,
    HighlightPipe1
  ],
  exports : [
    HighlightPipe,
    HighlightPipe1
  ],

})
export class PackagesModule { }
