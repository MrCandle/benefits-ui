import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BenefitListComponent } from './benefit-list/benefit-list.component';
import { BenefitDetailComponent } from './benefit-detail/benefit-detail.component';
import { BenefitEditComponent } from './benefit-edit/benefit-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BenefitListComponent
  },
  {
    path: ':id',
    component: BenefitDetailComponent
  },
  {
    path: ':id/edit',
    component: BenefitEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitsRoutingModule { }
