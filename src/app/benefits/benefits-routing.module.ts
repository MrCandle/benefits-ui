import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BenefitListComponent } from './benefit-list/benefit-list.component';

const routes: Routes = [
  {
    path: '',
    component: BenefitListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitsRoutingModule { }
