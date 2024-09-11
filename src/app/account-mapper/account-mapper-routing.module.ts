/** Angular Imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Custom Services */
import { Route } from 'app/core/route/route.service';

/** Custom Components */
import { AccountMapperComponent } from './account-mapper/account-mapper.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { CreateBeneficiariesComponent } from './create-beneficiaries/create-beneficiaries.component';

/**
 * Account Mapper Routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: 'dashboard',
      children: [
        {
          path: 'account-mapper',
          component: AccountMapperComponent,
          data: { title: 'Account Mapper', breadcrumb: 'Account Mapper' },
          children: [
            {
              path: "",
              redirectTo: "beneficiaries",
              pathMatch: "full",
            },
            {
              path: "beneficiaries",
              component: BeneficiariesComponent,
              data: { breadcrumb: { skip: true } },
            },
            {
              path: "create-beneficiaries",
              component: CreateBeneficiariesComponent,
              data: { breadcrumb: { skip: true } },
            },
          ],
        },
      ],
    },
  ]),
];

/**
 * Account Mapper Routing Module
 * 
 * Configures the routes for the Account Mapper Module
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
    ],
})
export class AccountMapperRoutingModule { }

