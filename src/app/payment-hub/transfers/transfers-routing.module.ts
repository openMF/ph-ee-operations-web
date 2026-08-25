/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { TransfersComponent } from './transfers.component';

/** Transfers Routes */
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { skip: true } },
    children: [
      {
        path: '',
        component: TransfersComponent,
      },
      {
        path: ':subBatchId',
        data: { breadcrumb: { alias: 'Transactions' } },
        component: TransfersComponent,
      },
    ],
  }
];

/**
 * Transfers Routing Module
 *
 * Configures the transfers routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TransfersRoutingModule { }
