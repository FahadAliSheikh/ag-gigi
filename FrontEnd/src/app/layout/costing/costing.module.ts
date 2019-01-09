import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostingRoutingModule } from './costing-routing.module';
import { CostingComponent } from './costing/costing.component';
//material
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';




import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HighlightPipe} from './costing/costing.component';
import {} from './costing/costing.component';
import { ViewAllCostingComponent } from './view-all-costing/view-all-costing.component';
import { CreatePackageCostingComponent } from './create-package-costing/create-package-costing.component'


@NgModule({
  imports: [
    CommonModule,
    CostingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatToolbarModule,
    MatListModule,
    MatRippleModule

  ],
  declarations: [
    CostingComponent,
    HighlightPipe,
    ViewAllCostingComponent,
    CreatePackageCostingComponent
  ],
  exports : [HighlightPipe]
})
export class CostingModule {}
