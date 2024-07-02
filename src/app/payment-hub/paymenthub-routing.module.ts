/** TODO: Separate routing into feature modules for cleaner accounting module. */

/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { IncomingTransactionsComponent } from "./transactions/incoming/incoming-transactions.component";
import { TransactionDetailsComponent } from "./transactions/transaction-details.component";
import { PaymentHubComponent } from "./paymenthub.component";
import { IncomingRequestToPayComponent } from "./request-to-pay/incoming/incoming-request-to-pay.component";
import { OutgoingRequestToPayComponent } from "./request-to-pay/outgoing/outgoing-request-to-pay.component";
import { RequestToPayDetailsComponent } from "./request-to-pay/request-to-pay-details.component";
import { IncomingRecallsComponent } from './recalls/incoming/incoming-recalls.component';
import { OutgoingRecallsComponent } from './recalls/outgoing/outgoing-recalls.component';
import { RecallDetailsComponent } from './recalls/recall-details.component';
import { CurrenciesResolver } from './transactions/resolver/currencies.resolver';
import { TransactionResolver } from './transactions/resolver/transaction.resolver';
import { RecallResolver } from './recalls/resolver/recall.resolver';
import { OutgoingTransactionsComponent } from './transactions/outgoing/outgoing-transactions.component';
import { DfspResolver } from './transactions/resolver/dfsp.resolver';
import { RequestToPayResolver } from './request-to-pay/resolver/request-to-pay.resolver';
import { IncomingRequestExportComponent } from './request-to-pay/incoming-request-export/incoming-request-export.component';
import {ListTasksComponent} from './tasks/list/list-tasks.component';
import {MyTasksComponent} from './tasks/my/my-tasks.component';
import {ListTaskViewComponent} from './tasks/list/view/list-task-view.component';
import {ZeebeTaskResolver} from './tasks/zeebe-task.resolver';
import {MyTaskViewComponent} from './tasks/my/view/my-task-view.component';
import { IncomingIg2FilesComponent } from './ig2-files/incoming/incoming-ig2-files.component';
import { OutgoingIg2FilesComponent } from './ig2-files/outgoing/outgoing-ig2-files.component';
import { Ig2FileDetailsComponent } from './ig2-files/ig2-file-details.component';

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
        {
          path: 'incomingrecalls',
          data: { title: extract('Search Incoming Recalls'), breadcrumb: 'Incoming Recalls' },
          children: [
            {
              path: '',
              component: IncomingRecallsComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: RecallDetailsComponent,
              data: { title: extract('View Recall'), routeParamBreadcrumb: 'id' },
              resolve: {
                recall: RecallResolver,
                dfspEntries: DfspResolver
              }
            }
          ]
        },
        {
          path: 'outgoingrecalls',
          data: { title: extract('Search Outgoing Recalls'), breadcrumb: 'Outgoing Recalls' },
          children: [
            {
              path: '',
              component: OutgoingRecallsComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: RecallDetailsComponent,
              data: { title: extract('View Recall'), routeParamBreadcrumb: 'id' },
              resolve: {
                recall: RecallResolver,
                dfspEntries: DfspResolver
              }
            }
          ]
        },
        {
          path: 'incomingig2files',
          data: { title: extract('Search Incoming Ig2 Files'), breadcrumb: 'Incoming Ig2 Files' },
          children: [
            {
              path: '',
              component: IncomingIg2FilesComponent
            },
            {
              path: 'view/:id',
              component: Ig2FileDetailsComponent,
              data: { title: extract('View Ig2 File'), routeParamBreadcrumb: 'id' }
            }
          ]
        },
        {
          path: 'outgoingig2files',
          data: { title: extract('Search Outgoing Ig2 Files'), breadcrumb: 'Outgoing Ig2 Files' },
          children: [
            {
              path: '',
              component: OutgoingIg2FilesComponent
            },
            {
              path: 'view/:id',
              component: Ig2FileDetailsComponent,
              data: { title: extract('View Ig2 File'), routeParamBreadcrumb: 'id' }
            }
          ]
        },
        {
          path: 'incomingrequesttopay',
          data: { title: extract('Search Incoming Request To Pay'), breadcrumb: 'Incoming Request To Pay' },
          children: [
            {
              path: '',
              component: IncomingRequestToPayComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: RequestToPayDetailsComponent,
              data: { title: extract('View Request To Pay'), routeParamBreadcrumb: 'id' },
              resolve: {
                requestToPay: RequestToPayResolver,
                dfspEntries: DfspResolver
              }
            },
          ]
        },
        {
          path: 'outgoingrequesttopay',
          data: { title: extract('Search Outgoing Request To Pay'), breadcrumb: 'Outgoing Request To Pay' },
          children: [
            {
              path: '',
              component: OutgoingRequestToPayComponent,
              resolve: {
                currencies: CurrenciesResolver,
                dfspEntries: DfspResolver
              }
            },
            {
              path: 'view/:id',
              component: RequestToPayDetailsComponent,
              data: { title: extract('View Request To Pay'), routeParamBreadcrumb: 'id' },
              resolve: {
                requestToPay: RequestToPayResolver,
                dfspEntries: DfspResolver
              }
            },
          ]
        },
        {
          path: 'incomingrequesttopayexport',
          data: { title: extract(''), breadcrumb: 'Export Incoming Request to Pay' },
          children: [
            {
              path: '',
              component: IncomingRequestExportComponent,
            }
          ]
        },
        {
          path: 'listtasks',
          data: { title: extract('List Tasks'), breadcrumb: 'List Tasks' },
          children: [
            {
              path: '',
              component: ListTasksComponent,
            },
            {
              path: 'view/:id',
              component: ListTaskViewComponent,
              data: { title: extract('View Task'), routeParamBreadcrumb: 'id' },
              resolve: {
                taskData: ZeebeTaskResolver,
              }
            }
          ]
        },
        {
          path: 'mytasks',
          data: { title: extract('My Tasks'), breadcrumb: 'My Tasks' },
          children: [
            {
              path: '',
              component: MyTasksComponent,
            },
            {
              path: 'view/:id',
              component: MyTaskViewComponent,
              data: { title: extract('View My Task'), routeParamBreadcrumb: 'id' },
              resolve: {
                taskData: ZeebeTaskResolver,
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
    RecallResolver,
    DfspResolver,
    RequestToPayResolver,
    RequestToPayResolver,
    ZeebeTaskResolver,
  ]
})
export class PaymentHubRoutingModule { }
