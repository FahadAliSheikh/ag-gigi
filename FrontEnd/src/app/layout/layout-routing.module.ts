import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import {AuthGuard} from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: '', loadChildren: './landing/landing.module#LandingModule' },
      { path: 'packages', loadChildren: './packages/packages.module#PackagesModule' },
      { path: 'clients', loadChildren: './clients/clients.module#ClientsModule' },
      { path: 'costing', loadChildren: './costing/costing.module#CostingModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
