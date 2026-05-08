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
import { DirectivesModule } from 'app/directives/directives.module';

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
        FilterSelectorComponent
    ]
})
export class PaymentHubModule {}
