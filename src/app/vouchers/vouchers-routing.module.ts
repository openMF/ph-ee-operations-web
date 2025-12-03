/** Angular Imports */
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

/** Routing Imports */
import { Route } from "app/core/route/route.service";

/** Custom Components */
import { VouchersComponent } from "./vouchers/vouchers.component";
import { VoucherManagementComponent } from "./voucher-management/voucher-management.component";
import { VouchersBulkImportComponent } from "./vouchers-bulk-import/vouchers-bulk-import.component";


/**
 * Vouchers Routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: "dashboard",
      children: [
        {
          path: "vouchers",
          component: VouchersComponent,
          data: {
            title: "Voucher Management",
            breadcrumb: "Voucher Management",
          },
          children: [
            {
              path: "",
              redirectTo: "voucher-management",
              pathMatch: "full",
            },
            {
              path: "voucher-management",
              component: VoucherManagementComponent,
              data: { breadcrumb: { skip: true } },
            },
            {
              path: "bulk-import",
              component: VouchersBulkImportComponent,
              data: { breadcrumb: { skip: true } },
            },
          ],
        },
      ],
    },
  ]),
];

/**
  * Vouchers Routing Module
  * 
  * Configures the routes for the Vouchers Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class VouchersRoutingModule {}
