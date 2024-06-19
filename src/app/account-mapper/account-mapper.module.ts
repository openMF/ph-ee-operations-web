import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountMapperComponent } from './account-mapper/account-mapper.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { AccountMapperRoutingModule } from './account-mapper-routing.module';



@NgModule({
  declarations: [
    AccountMapperComponent
  ],
  imports: [
    AccountMapperRoutingModule,
    CommonModule,
    SharedModule,
    PipesModule
  ]
})
export class AccountMapperModule { }
