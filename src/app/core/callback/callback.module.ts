/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../../shared/shared.module';
import { CallbackRoutingModule } from './callback-routing.module';

/** Custom Components */
import { CallbackComponent } from './callback.component';

/**
 * Login Module
 *
 * All components related to user authentication should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    CallbackRoutingModule
  ],
  declarations: [
    CallbackComponent,
  ]
})
export class CallbackModule { }
