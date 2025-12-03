import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizationsComponent } from './visualizations/visualizations.component';
import { VisualizationsRoutingModule } from './visualizations-routing.module';
import { VisualizationsSelectorComponent } from './visualizations-selector/visualizations-selector.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { SharedModule } from 'app/shared/shared.module';

/**
 * Visualizations Module.
 * 
 * Contains all visualizations components and modules.
 */
@NgModule({
  declarations: [
    VisualizationsComponent,
    VisualizationsSelectorComponent,
  ],
  imports: [
    VisualizationsRoutingModule,
    CommonModule,
    DirectivesModule,
    SharedModule
  ]
})
export class VisualizationsModule { }
