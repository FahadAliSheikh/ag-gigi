import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllCompaniesComponent } from './view-all-companies/view-all-companies.component';
import { ClientComponent } from './client.component';
import { ViewAllBuyersComponent } from './view-all-buyers/view-all-buyers.component';
import { ViewAllConcernedPersonsComponent } from './view-all-concerned-persons/view-all-concerned-persons.component';
const routes: Routes = [
  {
    path: '', component: ClientComponent,
    children: [
      { path: '', component: ViewAllCompaniesComponent },
      { path: 'view-all-buyers/:company_id', component: ViewAllBuyersComponent },
      { path: 'view-all-concernedPersons/:buyer_id', component: ViewAllConcernedPersonsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
