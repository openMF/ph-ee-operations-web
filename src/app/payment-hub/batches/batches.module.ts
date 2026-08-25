import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { BatchesRoutingModule } from './batches-routing.module';
import { BatchesComponent } from './batches.component';
import { BatchesBulkImportComponent } from '../batches-bulk-import/batches-bulk-import.component';

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    BatchesRoutingModule
  ],
  declarations: [
    BatchesComponent,
    BatchesBulkImportComponent
  ]
})
export class BatchesModule { }
