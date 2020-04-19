/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { PaymentHubRoutingModule } from './paymenthub-routing.module';

/** Custom Components */
import { IncomingTransactionsComponent } from './transactions/incoming/incoming-transactions.component';
import { OutgoingTransactionsComponent } from './transactions/outgoing/outgoing-transactions.component';
import { PaymentHubComponent } from './paymenthub.component';
import { TransactionDetailsComponent } from './transactions/transaction-details.component';


/**
 * Payment HUB Module
 *
 * All components related to payment hub functions should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    PaymentHubRoutingModule
  ],
  declarations: [
    IncomingTransactionsComponent,
    OutgoingTransactionsComponent,
    TransactionDetailsComponent,
    PaymentHubComponent
  ],
  entryComponents: [
    PaymentHubComponent,
  ]
})
export class PaymentHubModule { }
