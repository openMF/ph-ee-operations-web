import { Component } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { VoucherInstruction } from '../models/vouchers-model';
import { NgxCsvParser } from 'ngx-csv-parser';
import { MatTableDataSource } from '@angular/material/table';
import { v4 as uuid } from 'uuid';
import { VouchersService } from '../services/vouchers.service';

@Component({
  selector: 'mifosx-vouchers-bulk-import',
  templateUrl: './vouchers-bulk-import.component.html',
  styleUrls: ['./vouchers-bulk-import.component.scss']
})
export class VouchersBulkImportComponent {
  files: any[] = [];
  voucherInstructions: VoucherInstruction[] = [];

  displayedColumns: string[] = ['rowId', 'instructionId', 'groupCode', 'currency', 'amount', 'expiry', 'functionalId', 'narration'];
  dataSource = new MatTableDataSource();

  totalRows = 0;
  pageSize = 10;
  isLoading = false;

  constructor(private alertService: AlertService,
    private csvParse: NgxCsvParser,
    private vouchersService: VouchersService) { }

  onFileChange(fileList: File[]): void {
    this.isLoading = true;
    this.files = Object.keys(fileList).map(key => fileList[key]);
    this.csvParse.parse(this.files[0], {header: true, delimiter: ','})
    .pipe().subscribe((results: Array<VoucherInstruction>) => {
      this.voucherInstructions = [];
      results.forEach((item: any) => {
        this.voucherInstructions.push({
          instructionId: item['Instruction Id'],
          groupCode: item['Voucher Group Code'],
          currency: item['Currency'],
          amount: item['Amount'],
          expiry: item['Expiry'],
          functionalId: item['Payee Functional Id'],
          narration: item['Narration'] || null
        });
      });
      this.totalRows = this.voucherInstructions.length;

      this.dataSource = new MatTableDataSource(this.voucherInstructions);
      this.isLoading = false;
    });
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully parsed!' });
  }

  deleteFile(f: any) {
    this.files = this.files.filter(function (w) { return w.name != f.name });
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully delete!' });
  }

  isFileAdded(): boolean {
    return (this.files.length > 0);
  }

  sendData(): void {
    const payload = {
      requestID: uuid(),
      batchID: uuid(),
      voucherInstructions: this.voucherInstructions
    };
    console.log(payload);
    this.vouchersService.createVoucher(payload).subscribe((response: any) => {
      console.log(response);
    });
  }

}
