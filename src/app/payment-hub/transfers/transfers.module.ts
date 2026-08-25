import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { TransfersRoutingModule } from './transfers-routing.module';
import { TransfersComponent } from './transfers.component';
import { ViewTransferDetailsComponent } from './view-transfer-details/view-transfer-details.component';
import { SubBatchSummaryComponent } from './sub-batch-summary/sub-batch-summary.component';

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    TransfersRoutingModule
  ],
  declarations: [
    TransfersComponent,
    ViewTransferDetailsComponent,
    SubBatchSummaryComponent
  ]
})
export class TransfersModule { }
