import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VouchersComponent } from './vouchers/vouchers.component';
import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherManagementComponent } from './voucher-management/voucher-management.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { VouchersSectionFilterComponent } from './vouchers-section-filter/vouchers-section-filter.component';
import { VouchersBulkImportComponent } from './vouchers-bulk-import/vouchers-bulk-import.component';



@NgModule({
  declarations: [
    VouchersComponent,
    VoucherManagementComponent,
    VouchersSectionFilterComponent,
    VouchersBulkImportComponent
  ],
  imports: [
    VouchersRoutingModule,
    CommonModule,
    SharedModule,
    PipesModule
  ]
})
export class VouchersModule { }
