/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../../core/route/route.service';

/** Custom Components */
import { CallbackComponent } from './callback.component';

/** Home and Dashboard Routes */
const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent,
  }
];

/**
 * Cakllback Routing Module
 *
 * Configures the home and dashboard routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CallbackRoutingModule { }
