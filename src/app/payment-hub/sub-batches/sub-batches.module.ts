import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { SubBatchesRoutingModule } from './sub-batches-routing.module';
import { SubBatchesComponent } from './sub-batches.component';
import { BatchSummaryComponent } from './batch-summary/batch-summary.component';

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    SubBatchesRoutingModule
  ],
  declarations: [
    SubBatchesComponent,
    BatchSummaryComponent
  ]
})
export class SubBatchesModule { }
