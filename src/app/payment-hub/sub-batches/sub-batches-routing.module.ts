/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { SubBatchesComponent } from './sub-batches.component';

/** Sub Batches Routes */
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { skip: true } },
    children: [
      {
        path: '',
        component: SubBatchesComponent,
      },
      {
        path: ':batchId',
        data: { breadcrumb: { alias: 'SubBatches' } },
        component: SubBatchesComponent,
      },
    ],
  }
];

/**
 * Sub Batches Routing Module
 *
 * Configures the sub batches routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SubBatchesRoutingModule { }
