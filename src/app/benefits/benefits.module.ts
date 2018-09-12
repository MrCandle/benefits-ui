import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitsRoutingModule } from './benefits-routing.module';
import { BenefitDetailComponent } from './benefit-detail/benefit-detail.component';
import { BenefitEditComponent } from './benefit-edit/benefit-edit.component';
import { BenefitListComponent } from './benefit-list/benefit-list.component';

@NgModule({
  imports: [
    CommonModule,
    BenefitsRoutingModule
  ],
  declarations: [BenefitDetailComponent, BenefitEditComponent, BenefitListComponent]
})
export class BenefitsModule { }
