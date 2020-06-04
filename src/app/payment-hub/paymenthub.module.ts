/** Angular Imports */
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { PaymentHubRoutingModule } from './paymenthub-routing.module';
import { PipesModule } from '../pipes/pipes.module';

/** Custom Components */
import { IncomingTransactionsComponent } from './transactions/incoming/incoming-transactions.component';
import { OutgoingTransactionsComponent } from './transactions/outgoing/outgoing-transactions.component';
import { PaymentHubComponent } from './paymenthub.component';
import { TransactionDetailsComponent } from './transactions/transaction-details.component';
import { BpmnDialogComponent } from './transactions/bpmn-dialog/bpmn-dialog.component';
import { RetryResolveDialogComponent } from './transactions/retry-resolve-dialog/retry-resolve-dialog.component';

/**
 * Payment HUB Module
 *
 * All components related to payment hub functions should be declared here.
 */
@NgModule({
  imports: [
    MatDialogModule,
    SharedModule,
    PaymentHubRoutingModule,
    PipesModule
  ],
  declarations: [
    IncomingTransactionsComponent,
    OutgoingTransactionsComponent,
    TransactionDetailsComponent,
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent
  ],
  entryComponents: [
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent
  ]
})
export class PaymentHubModule { }
