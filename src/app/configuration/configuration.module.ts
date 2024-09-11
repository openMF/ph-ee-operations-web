import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { G2pSectionFilterComponent } from './g2p-section-filter/g2p-section-filter.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { G2pPaymentComponent } from './g2p-payment/g2p-payment.component';
import { CreateG2pPaymentComponent } from './create-g2p-payment/create-g2p-payment.component';
import { UpdateG2pPaymentComponent } from './update-g2p-payment/update-g2p-payment.component';


@NgModule({
  declarations: [
    G2pPaymentComponent,
    G2pSectionFilterComponent,
    ConfigurationComponent,
    CreateG2pPaymentComponent,
    UpdateG2pPaymentComponent

  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    PipesModule
  ]
})
export class ConfigurationModule { }
