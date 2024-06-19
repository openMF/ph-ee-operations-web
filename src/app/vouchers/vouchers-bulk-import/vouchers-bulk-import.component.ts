import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { NgxCsvParser } from 'ngx-csv-parser';
import { MatTableDataSource } from '@angular/material/table';
import { VouchersService } from '../services/vouchers.service';

import * as XLSX from 'xlsx';
import { VoucherInstruction } from '../models/vouchers-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'mifosx-vouchers-bulk-import',
  templateUrl: './vouchers-bulk-import.component.html',
  styleUrls: ['./vouchers-bulk-import.component.scss']
})
export class VouchersBulkImportComponent implements OnInit {

  /** Paginator for table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for reports table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  createVoucherForm: UntypedFormGroup;

  voucherInstructions: VoucherInstruction[] = [];

  files: File[] = [];
  requestID: string;
  batchID: string;

  displayedColumns: string[] = ['rowId', 'instructionId', 'groupCode', 'currency', 'amount', 'expiry', 'functionalId', 'narration'];
  dataSource = new MatTableDataSource();

  totalRows = 0;
  currentPage = 1;
  isLoading = false;

  constructor(private alertService: AlertService,
    private csvParse: NgxCsvParser,
    private vouchersService: VouchersService,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.createVoucherForm = this.formBuilder.group({
      'callbackUrl': [environment.backend.voucherCallbackUrl, Validators.required],
      'requestId': [this.generateID(12), Validators.required]
    });
  }

  onFileChange(file: File): void {
    this.processFiles(file);
  }

  deleteFile(f: any) {
    this.files = this.files.filter((w: any) => w.name !== f.name);
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully delete!' });
  }

  isFileAdded(): boolean {
    return (this.files.length > 0);
  }

  processFiles(file: File): void {
    this.isLoading = true;
    this.csvParse.parse(file, { header: true, delimiter: ',' })
      .pipe().subscribe((results: Array<VoucherInstruction>) => {
        this.voucherInstructions = [];
        results.forEach((item: any) => {
          this.voucherInstructions.push({
            instructionID: item['Instruction Id'],
            groupCode: item['Voucher Group Code'],
            currency: item['Currency'],
            amount: item['Amount'],
            expiry: item['Expiry'],
            payeeFunctionalID: item['Payee Functional Id'],
            narration: item['Narration'] || null
          });
        });
        this.files.push(file);
        this.totalRows = this.voucherInstructions.length;

        this.dataSource = new MatTableDataSource(this.voucherInstructions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.batchID = this.generateID(12);
        this.isLoading = false;
      });
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully parsed!' });
  }

  generateID(n: number): string {
    const add = 1;
    let max = 12 - add;

    if (n > max) {
      return this.generateID(max) + this.generateID(n - max);
    }

    max = Math.pow(10, n + add);
    const min = max / 10; // Math.pow(10, n) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ('' + number).substring(add);
  }

  downloadTemplate(): void {
    const fileName = `Vouchers_Template.xls`;
    const data: any[] = [];
    const columns: string[] = ['Instruction Id', 'Group Code', 'Currency', 'Amount', 'Expiry', 'Functional Id'];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'vouchers');
    XLSX.writeFile(wb, fileName);
  }

  sendData(): void {
    const requestId: string = this.createVoucherForm.value.requestId;
    const callbackUrl: string = this.createVoucherForm.value.callbackUrl;

    const payload = {
      requestID: requestId,
      batchID: this.batchID,
      voucherInstructions: this.voucherInstructions
    };
    this.vouchersService.createVoucher(callbackUrl, payload).subscribe((response: any) => {
      const msg = response.responseDescription + '\n Request Id: ' + response.requestID;
      this.alertService.alert({ type: 'Voucher File Upload', message: msg });
      this.clearData();
    });
  }

  clearData(): void {
    this.voucherInstructions = [];
    this.dataSource = new MatTableDataSource(this.voucherInstructions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalRows = 0;
    this.files = [];
    this.createVoucherForm.patchValue({
      'requestId': this.generateID(12),
      'callbackUrl': environment.backend.voucherCallbackUrl
    });
  }

  pageChanged(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
}
