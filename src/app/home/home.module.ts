/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

/** Custom Components */
import { DashboardComponent } from './dashboard/dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'app/directives/directives.module';

/**
 * Home Component
 *
 * Home and dashboard components should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class HomeModule { }
