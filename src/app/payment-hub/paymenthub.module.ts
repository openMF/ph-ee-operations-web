/** Angular Imports */
import { NgModule } from '@angular/core';

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
import { FilterSelectorComponent } from './filter-selector/filter-selector.component';
import { BatchesComponent } from './batches/batches.component';
import { SubBatchesComponent } from './sub-batches/sub-batches.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { TransfersComponent } from './transfers/transfers.component';
import { BatchesBulkImportComponent } from './batches-bulk-import/batches-bulk-import.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewTransferDetailsComponent } from './transfers/view-transfer-details/view-transfer-details.component';
/**
 * Payment HUB Module
 *
 * All components related to payment hub functions should be declared here.
 */
@NgModule({
    imports: [
        SharedModule,
        PaymentHubRoutingModule,
        PipesModule,
        DirectivesModule
    ],
    declarations: [
        IncomingTransactionsComponent,
        OutgoingTransactionsComponent,
        TransactionDetailsComponent,
        PaymentHubComponent,
        BpmnDialogComponent,
        RetryResolveDialogComponent,
        FilterSelectorComponent,
        BatchesComponent,
        SubBatchesComponent,
        TransfersComponent,
        BatchesBulkImportComponent,
        ViewTransferDetailsComponent,
    ]
})
export class PaymentHubModule {}
