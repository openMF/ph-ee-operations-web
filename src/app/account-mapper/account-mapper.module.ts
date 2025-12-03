/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Components */
import { AccountMapperComponent } from './account-mapper/account-mapper.component';
import { FilterSelectorComponent } from './filter-selector/filter-selector.component';
import { CreateBeneficiariesComponent } from './create-beneficiaries/create-beneficiaries.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';

/** Custom Modules */
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { AccountMapperRoutingModule } from './account-mapper-routing.module';

/**
 * Account Mapper Module
 */
@NgModule({
  declarations: [
    AccountMapperComponent,
    FilterSelectorComponent,
    CreateBeneficiariesComponent,
    BeneficiariesComponent
  ],
  imports: [
    AccountMapperRoutingModule,
    CommonModule,
    SharedModule,
    PipesModule
  ]
})
export class AccountMapperModule { }
