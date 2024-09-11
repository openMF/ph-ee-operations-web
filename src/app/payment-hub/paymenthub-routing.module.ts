/** TODO: Separate routing into feature modules for cleaner accounting module. */

/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Custom Components */
import { TransactionDetailsComponent } from './transactions/transaction-details.component';
import { PaymentHubComponent } from './paymenthub.component';
import { BatchesComponent } from './batches/batches.component';
import { SubBatchesComponent } from './sub-batches/sub-batches.component';
import { TransfersComponent } from './transfers/transfers.component';
import { BatchesBulkImportComponent } from './batches-bulk-import/batches-bulk-import.component';

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
              data: { breadcrumb: { skip: true } },
              component: BatchesComponent,
            },
            {
              path: 'bulk-import',
              data: { breadcrumb: { alias: 'Batch Bulk Import' } },
              component: BatchesBulkImportComponent,
            },
            {
              path: 'sub-batches',
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
            },
            {
              path: 'sub-batches',
              data: { breadcrumb: { skip: true } },
              children: [
                {
                  path: ':batchId',
                  data: { breadcrumb: { alias: 'SubBatches' } },
                  children: [
                    {
                      path: 'transfers',
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
                    },
                  ],
                },
              ],
            },

            {
              path: 'transactions',
              children: [
                {
                  path: '',
                  component: TransfersComponent,
                },
                {
                  path: 'view/:id',
                  component: TransactionDetailsComponent,
                  data: { breadcrumb: { alias: 'View Transaction' } },
                  resolve: {
                    transaction: TransactionResolver,
                    dfspEntries: DfspResolver,
                  },
                },
              ],
            },
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
