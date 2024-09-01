import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Route } from "app/core/route/route.service";
import { VisualizationsComponent } from "./visualizations/visualizations.component";
import { VisualizationsSelectorComponent } from "./visualizations-selector/visualizations-selector.component";

/**
 * Visualizations Routes
 */
const routes: Routes = [
  Route.withShell([
    {
        path: "dashboard",
        children: [
          {
            path: "visualizations",
         
            data: { title: "Visualizations", breadcrumb: "Visualizations" },
            children: [
              {
                path: "",
                component: VisualizationsSelectorComponent,
              },
              {
                path: "user-management",
                component: VisualizationsComponent,
                data: { title: "Visualizations", breadcrumb: "User Management" },
              
              }
            ],
          },
        ],
      },
  ])
];

/**
  * Visualizations Routing Module
  * 
  * Configures the routes for the Visualizations Module
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
  })
  export class VisualizationsRoutingModule {}