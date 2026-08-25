/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Custom Components */
import { PaymentHubComponent } from './paymenthub.component';

/** Custom Resolvers */
import { CurrenciesResolver } from './transactions/resolver/currencies.resolver';
import { TransactionResolver } from './transactions/resolver/transaction.resolver';
import { DfspResolver } from './transactions/resolver/dfsp.resolver';

/** Payment HUB Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'dashboard',
      children: [
        {
          path: 'paymenthub',
          component: PaymentHubComponent,
          data: { title: 'Payment Hub EE', breadcrumb: 'Payment Hub EE' },
          children: [
            {
              path: '',
              redirectTo: 'batches',
              pathMatch: 'full',
            },
            {
              path: 'batches',
              loadChildren: () => import('./batches/batches.module').then(m => m.BatchesModule)
            },
            {
              path: 'sub-batches',
              loadChildren: () => import('./sub-batches/sub-batches.module').then(m => m.SubBatchesModule)
            },
            {
              path: 'transfers',
              loadChildren: () => import('./transfers/transfers.module').then(m => m.TransfersModule)
            }
          ],
        },
      ],
    },
  ]),
];

/**
 * Payment HUB Routing Module
 *
 * Configures the payment hub routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CurrenciesResolver, TransactionResolver, DfspResolver],
})
export class PaymentHubRoutingModule {}
