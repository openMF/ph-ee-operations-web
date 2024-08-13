/** Angular Imports */
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { PaymentHubRoutingModule } from './paymenthub-routing.module';
import { PipesModule } from '../pipes/pipes.module';

/** Custom Components */
import { IncomingTransactionsComponent } from "./transactions/incoming/incoming-transactions.component";
import { OutgoingTransactionsComponent } from "./transactions/outgoing/outgoing-transactions.component";
import { PaymentHubComponent } from "./paymenthub.component";
import { TransactionDetailsComponent } from "./transactions/transaction-details.component";
import { IncomingRequestToPayComponent } from "./request-to-pay/incoming/incoming-request-to-pay.component";
import { OutgoingRequestToPayComponent } from "./request-to-pay/outgoing/outgoing-request-to-pay.component";
import { RequestToPayDetailsComponent } from "./request-to-pay/request-to-pay-details.component";
import { IncomingRequestExportComponent } from "./request-to-pay/incoming-request-export/incoming-request-export.component";
import { IncomingRecallsComponent } from './recalls/incoming/incoming-recalls.component';
import { OutgoingRecallsComponent } from './recalls/outgoing/outgoing-recalls.component';
import { RecallDetailsComponent } from './recalls/recall-details.component';
import { BpmnDialogComponent } from './common/bpmn-dialog/bpmn-dialog.component';
import { RetryResolveDialogComponent } from './common/retry-resolve-dialog/retry-resolve-dialog.component';
import {ListTasksComponent} from './tasks/list/list-tasks.component';
import {MyTasksComponent} from './tasks/my/my-tasks.component';
import {ButtonComponent} from './tasks/task-view/components/button/button.component';
import {CheckboxComponent} from './tasks/task-view/components/checkbox/checkbox.component';
import {DateComponent} from './tasks/task-view/components/date/date.component';
import {DynamicFieldDirective} from './tasks/task-view/components/dynamic-field/dynamic-field.directive';
import {DynamicFormComponent} from './tasks/task-view/components/dynamic-form/dynamic-form.component';
import {InputComponent} from './tasks/task-view/components/input/input.component';
import {RadiobuttonComponent} from './tasks/task-view/components/radiobutton/radiobutton.component';
import {SelectComponent} from './tasks/task-view/components/select/select.component';
import {ListTaskViewComponent} from './tasks/list/view/list-task-view.component';
import {MyTaskViewComponent} from './tasks/my/view/my-task-view.component';
import {RadiobuttonBooleanComponent} from './tasks/task-view/components/radiobuttonboolean/radiobuttonboolean.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { IncomingIg2FilesComponent } from './ig2-files/incoming/incoming-ig2-files.component';
import { OutgoingIg2FilesComponent } from './ig2-files/outgoing/outgoing-ig2-files.component';
import { Ig2FileDetailsComponent } from './ig2-files/ig2-file-details.component';

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
    DirectivesModule
  ],
  declarations: [
    IncomingTransactionsComponent,
    OutgoingTransactionsComponent,
    TransactionDetailsComponent,
    IncomingRecallsComponent,
    OutgoingRecallsComponent,
    RecallDetailsComponent,
    IncomingIg2FilesComponent,
    OutgoingIg2FilesComponent,
    Ig2FileDetailsComponent,
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent,
    IncomingRequestToPayComponent,
    OutgoingRequestToPayComponent,
    RequestToPayDetailsComponent,
    IncomingRequestExportComponent,
    ListTasksComponent,
    MyTasksComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    InputComponent,
    RadiobuttonComponent,
    RadiobuttonBooleanComponent,
    SelectComponent,
    DynamicFormComponent,
    ListTaskViewComponent,
    MyTaskViewComponent,
  ],
  entryComponents: [
    PaymentHubComponent,
    BpmnDialogComponent,
    RetryResolveDialogComponent
  ]
})
export class PaymentHubModule { }
