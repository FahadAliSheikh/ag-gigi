import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllCostingComponent } from './view-all-costing/view-all-costing.component'
import { CostingComponent } from './costing/costing.component';
import { CreatePackageCostingComponent } from './create-package-costing/create-package-costing.component';

const routes: Routes = [
  { path: 'view-all-costs', component: ViewAllCostingComponent },
  { path: 'package/:id/create-costing', component: CostingComponent },
  { path: 'create-costing-of/:id', component: CreatePackageCostingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostingRoutingModule { }
