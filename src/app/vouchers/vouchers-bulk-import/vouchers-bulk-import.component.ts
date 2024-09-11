/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";

/** Custom Services */
import { VouchersService } from '../services/vouchers.service';
import { AlertService } from 'app/core/alert/alert.service';

/** Custom Components */
import { UploadDialogComponent } from 'app/shared/upload-dialog/upload-dialog.component';
import { SuccessDialogComponent } from 'app/shared/success-dialog/success-dialog.component';

/** Environment */
import { environment } from 'environments/environment';

/** Custom Models and Utils */
import { VoucherData, VoucherInstruction } from '../models/vouchers-model';

/** External Imports */
import { NgxCsvParser } from 'ngx-csv-parser';

/** Vouchers Bulk Import Component */
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

  /** Imported data from file. */
  importedData: any;

  /** Form group for create voucher form. */
  createVoucherForm: UntypedFormGroup;

  voucherInstructions: VoucherInstruction[] = [];

  files: File[] = [];
  requestID: string;
  batchID: string;

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['rowId', 'instructionId', 'groupCode', 'currency', 'amount', 'expiry', 'functionalId', 'narration'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  totalRows = 0;
  currentPage = 1;
  isLoading = false;
  isFileUploaded = false;

  
  constructor(private alertService: AlertService,
    private csvParse: NgxCsvParser,
    private vouchersService: VouchersService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createVoucherForm = this.formBuilder.group({
      'callbackUrl': [environment.backend.voucherCallbackUrl, Validators.required],
      'requestId': [this.generateID(12), Validators.required]
    });

  }


  /** Upload file 
   * @param {any} f - file to be uploaded
   * @returns alert message if file is uploaded successfully
  */
  deleteFile(f: any) {
    this.files = this.files.filter((w: any) => w.name !== f.name);
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully delete!' });
  }

  /** Generate random number of n digits
   * @param {number} n - number of digits
   * @returns random number of n digits
  */
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

  /** Send data to backend */
  sendData(): void {
    const requestId: string = this.createVoucherForm.value.requestId;
    const callbackUrl: string = this.createVoucherForm.value.callbackUrl;

    const payload = {
      requestID: requestId,
      batchID: this.batchID,
      voucherInstructions: this.voucherInstructions
    };

    //for test-purpose
    this.openSuccessDialog();
    this.router.navigate(['dashboard/vouchers/voucher-management']);


    this.vouchersService.createVoucher(callbackUrl, payload).subscribe((response: any) => {
      const msg = response.responseDescription + '\n Request Id: ' + response.requestID;
      this.alertService.alert({ type: 'Voucher File Upload', message: msg });
      this.openSuccessDialog();
      this.router.navigate(['dashboard/vouchers/voucher-management']);
      this.clearData();
    });
  }

  /** Clear data on the form and the imported data*/
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
    this.isFileUploaded = false;
  }

  /** Page changed event */
  pageChanged(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  /** Open upload dialog to upload the file and download template */
  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '800px',
      height: '320px',
      data: {
        fileName: 'Vouchers_Template.xls',
        columns: ['Instruction Id', 'Group Code', 'Currency', 'Amount', 'Expiry', 'Functional Id', 'Description'],
        sheetName: 'vouchers',
        type: 'Vouchers'
      }
    });
    dialogRef.componentInstance.importedData.subscribe((data: VoucherData[]) => {
      this.updateTableData(data);
    });

    this.isFileUploaded = true;
  }

  /** Open success dialog after successful vouchers creation */
  openSuccessDialog(): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '800px',
      height:'500px',
      data:{
        params:{count:this.dataSource.data.length},
        key: 'labels.texts.VoucherCreated',
      }
    });
  }

  /** Update table data 
   * @param {VoucherData[]} data - data to be updated
   * @returns updated table data
   * */
  updateTableData(data: VoucherData[]): void {
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
