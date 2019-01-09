import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllPackagesComponent } from './view-all-packages/view-all-packages.component';
import {ViewOnePackageComponent} from './view-one-package/view-one-package.component';
import {AddNewPackageComponent} from './add-new-package/add-new-package.component';
import {EditPackageComponent} from './edit-package/edit-package.component';
const routes: Routes = [
  {path:'view-all-packages', component:ViewAllPackagesComponent},
  {path:'view-one-package/:id', component:ViewOnePackageComponent},
  {path:'add-new-package',component:AddNewPackageComponent},
  {path:'edit-package/:id',component:EditPackageComponent},
  {path:'', redirectTo:'view-all-packages', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
