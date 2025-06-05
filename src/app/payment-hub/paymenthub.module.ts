/** Angular Imports */
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";

/** Custom Modules */
import { SharedModule } from "../shared/shared.module";
import { PaymentHubRoutingModule } from "./paymenthub-routing.module";
import { PipesModule } from "../pipes/pipes.module";

/** Custom Components */
import { IncomingTransactionsComponent } from "./transactions/incoming/incoming-transactions.component";
import { OutgoingTransactionsComponent } from "./transactions/outgoing/outgoing-transactions.component";
import { PaymentHubComponent } from "./paymenthub.component";
import { TransactionDetailsComponent } from "./transactions/transaction-details.component";
import { BpmnDialogComponent } from "./transactions/bpmn-dialog/bpmn-dialog.component";
import { RetryResolveDialogComponent } from "./transactions/retry-resolve-dialog/retry-resolve-dialog.component";
import { IncomingRequestToPayComponent } from "./request-to-pay/incoming-request-to-pay/incoming-request-to-pay.component";
import { OutgoingRequestToPayComponent } from "./request-to-pay/outgoing-request-to-pay/outgoing-request-to-pay.component";
import { ViewRequestToPayComponent } from "./request-to-pay/view-request-to-pay/view-request-to-pay.component";
import { IncomingRequestExportComponent } from "./request-to-pay/incoming-request-export/incoming-request-export.component";
import { GetBatchesExportComponent } from "./request-to-pay/get-batches-export/get-batches-export.component";
import { BulkBatchExportComponent } from "./request-to-pay/bulk-batch-export/bulk-batch-export.component";
import { IncomingTransactionExportComponent } from './transactions/incoming-transaction-export/incoming-transaction-export.component';
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
    PipesModule,
  ],
  declarations: [
    IncomingTransactionsComponent,
    OutgoingTransactionsComponent,
    TransactionDetailsComponent,
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent,
    IncomingRequestToPayComponent,
    OutgoingRequestToPayComponent,
    ViewRequestToPayComponent,
    IncomingRequestExportComponent,
    BulkBatchExportComponent,
    GetBatchesExportComponent,
    IncomingTransactionExportComponent,
  ],
  entryComponents: [
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent,
  ],
})
export class PaymentHubModule {}
