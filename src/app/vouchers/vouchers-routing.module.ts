import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'app/core/route/route.service';
import { VouchersComponent } from './vouchers/vouchers.component';
import { VoucherManagementComponent } from './voucher-management/voucher-management.component';
import { VouchersBulkImportComponent } from './vouchers-bulk-import/vouchers-bulk-import.component';


const routes: Routes = [
    Route.withShell([
        {
            path: 'vouchers',
            component: VouchersComponent,
            data: { title: 'Voucher Management', breadcrumb: 'Voucher Management' },
            children: [
                {
                    path: '',
                    redirectTo: 'voucher-management',
                    pathMatch: 'full'
                },
                {
                    path: 'voucher-management',
                    component: VoucherManagementComponent
                },
                {
                    path: 'bulk-import',
                    component: VouchersBulkImportComponent
                }
            ]
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
    ],
})
export class VouchersRoutingModule { }

