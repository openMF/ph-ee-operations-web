/** TODO: Separate routing into feature modules for cleaner accounting module. */

/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { IncomingTransactionsComponent } from './transactions/incoming/incoming-transactions.component';
import { TransactionDetailsComponent } from './transactions/transaction-details.component';
import { PaymentHubComponent } from './paymenthub.component';
import { CurrenciesResolver } from './transactions/resolver/currencies.resolver';
import { TransactionResolver } from './transactions/resolver/transaction.resolver';
import { OutgoingTransactionsComponent } from './transactions/outgoing/outgoing-transactions.component';
import { DfspResolver } from './transactions/resolver/dfsp.resolver';
/** Payment HUB Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'paymenthubee',
      data: { title: extract('Payment Hub EE'), breadcrumb: 'Payment Hub EE' },
      children: [
        {
          path: '',
          component: PaymentHubComponent
        },
        {
          path: 'incomingtransactions',
          data: { title: extract('Search Incoming Transactions'), breadcrumb: 'Incoming Transactions' },
          children: [
            {
              path: '',
              component: IncomingTransactionsComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: TransactionDetailsComponent,
              data: { title: extract('View Transaction'), routeParamBreadcrumb: 'id' },
              resolve: {
                transaction: TransactionResolver,
                dfspEntries: DfspResolver
              }
            }
          ]
        },
        {
          path: 'outgoingtransactions',
          data: { title: extract('Search Outgoing Transactions'), breadcrumb: 'Outgoing Transactions' },
          children: [
            {
              path: '',
              component: OutgoingTransactionsComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: TransactionDetailsComponent,
              data: { title: extract('View Transaction'), routeParamBreadcrumb: 'id' },
              resolve: {
                transaction: TransactionResolver,
                dfspEntries: DfspResolver
              }
            }
          ]
        },
      ]
    },
  ])
];

/**
 * Payment HUB Routing Module
 *
 * Configures the payment hub routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CurrenciesResolver,
    TransactionResolver,
    DfspResolver
  ]
})
export class PaymentHubRoutingModule { }
