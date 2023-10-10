import { Component, OnInit } from '@angular/core';
import { Dates } from 'app/core/utils/dates';
import { VouchersService } from '../services/vouchers.service';
import { TransactionsDataSource } from 'app/payment-hub/transactions/dataSource/transactions.datasource';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'mifosx-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss']
})
export class VoucherManagementComponent implements OnInit {
  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  /** government Entity form control. */
  governmentEntity = new UntypedFormControl();
  /** serial Number form control. */
  serialNumber = new UntypedFormControl();
  /** functional Id form control. */
  functionalId = new UntypedFormControl();
  /** status form control. */
  status = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['serialNumber', 'createdAt', 'governmentEntity', 'functionalId', 'status'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;

  batchesData: any;

  page: number = 0;
  size: number = 100;

  constructor(private dates: Dates,
    private vouchersService: VouchersService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.vouchersService.getVouchers(this.page, this.size, 'requestFile', 'asc')
    .subscribe((batches: any) => {
      this.batchesData = batches;
    });
  }

  searchVouchers(): void {

  }

}
