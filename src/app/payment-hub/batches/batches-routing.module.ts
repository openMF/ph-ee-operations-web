/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { BatchesComponent } from './batches.component';
import { BatchesBulkImportComponent } from '../batches-bulk-import/batches-bulk-import.component';

/** Batches Routes */
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { skip: true } },
    component: BatchesComponent,
  },
  {
    path: 'bulk-import',
    data: { breadcrumb: { alias: 'Batch Bulk Import' } },
    component: BatchesBulkImportComponent,
  }
];

/**
 * Batches Routing Module
 *
 * Configures the batches routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BatchesRoutingModule { }
