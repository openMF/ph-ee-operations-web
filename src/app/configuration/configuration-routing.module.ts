/** Angular Imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Routing Imports */
import { Route } from 'app/core/route/route.service';

/** Custom Components */
import { ConfigurationComponent } from './configuration/configuration.component';
import { G2pPaymentComponent } from './g2p-payment/g2p-payment.component';
import { UpdateG2pPaymentComponent } from './update-g2p-payment/update-g2p-payment.component';
import { CreateG2pPaymentComponent } from './create-g2p-payment/create-g2p-payment.component';

/** Custom Resolvers */
import { ViewPaymentConfigResolver } from './resolver/view-payment.resolver';
import { G2PTemplateResolver } from './resolver/template.resolver';
import { G2PPaymentConfigsResolver } from './resolver/g2p-payment-configs.resolver';


/**
 * Configuration Routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: "dashboard",
      children: [
        {
          path: "configuration",
          component: ConfigurationComponent,
          data: { breadcrumb: { skip: true } },
          children: [
            {
              path: "",
              redirectTo: "g2p-payment-config",
              pathMatch: "full",
            },
            {
              path: "g2p-payment-config",

              data: { breadcrumb: "G2P Payment Config" },
              children: [
                {
                  path: "",
                  component: G2pPaymentComponent,
                  resolve: {
                    g2pPayments: G2PPaymentConfigsResolver
                  },
                },
                {
                  path: ":id",
                  resolve: {
                    program: ViewPaymentConfigResolver,
                    template: G2PTemplateResolver
                  },
                  component: UpdateG2pPaymentComponent,
                  data: { breadcrumb: { skip: true } },
                }

              ]

            },
            {
              path: "create",
              component: CreateG2pPaymentComponent,
              data: { breadcrumb: "Create"},
              resolve: {
                template: G2PTemplateResolver
              }
            },

          ],
        },
      ],
    },
  ])
];

/**
 * Configuration Routing Module
 * 
 * Configures the routes for the Configuration Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewPaymentConfigResolver, G2PTemplateResolver, G2PPaymentConfigsResolver]
})
export class ConfigurationRoutingModule { }
