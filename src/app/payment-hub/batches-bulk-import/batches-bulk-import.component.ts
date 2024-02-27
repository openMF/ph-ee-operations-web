import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/core/alert/alert.service';
import { NgxCsvParser } from 'ngx-csv-parser';

import * as XLSX from 'xlsx';
import { BatchesService } from '../batches/batches.service';
import { SettingsService } from 'app/settings/settings.service';
import { BatchInstruction } from '../batches/model/batch.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';

import { sha3_256 } from 'js-sha3';
import * as Forge from 'node-forge';
import * as uuid from 'uuid';

@Component({
  selector: 'mifosx-batches-bulk-import',
  templateUrl: './batches-bulk-import.component.html',
  styleUrls: ['./batches-bulk-import.component.scss']
})
export class BatchesBulkImportComponent implements OnInit {
  createBatchForm: UntypedFormGroup;

  files: File[] = [];
  batchInstructions: BatchInstruction[] = [];

  displayedColumns: string[] = ['rowId', 'requestId', 'CreditParty', 'DebitParty', 'subType', 'paymentMode', 'currency', 'amount', 'description'];
  dataSource = new MatTableDataSource();

  totalRows = 0;
  pageSize = 10;
  isLoading = false;

  constructor(private alertService: AlertService,
    private csvParse: NgxCsvParser,
    private formBuilder: UntypedFormBuilder,
    private batchesService: BatchesService,
    private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.createBatchForm = this.formBuilder.group({
      'institutionId': [environment.backend.registeringInstituionId, Validators.required],
      'programId': ['', Validators.required]
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
      .pipe().subscribe((results: Array<BatchInstruction>) => {
        this.batchInstructions = [];
        results.forEach((item: any) => {
          this.batchInstructions.push({
            requestId: item['Request'],
            creditParty: [{key: item['CreditParty Key'], value: item['CreditParty Value']}],
            debitParty: [{key: item['DebitParty Key'], value: item['DebitParty Value']}],
            paymentMode: item['Payment Mode'],
            currency: item['Currency'],
            amount: item['Amount'],
            descriptionText: item['Description'] || null
          });
        });
        // subType: item['SubType'] || null,
        this.files.push(file);
        this.totalRows = this.batchInstructions.length;

        this.dataSource = new MatTableDataSource(this.batchInstructions);
        this.isLoading = false;
      });
    this.alertService.alert({ type: 'Voucher File Upload', message: 'Successfully parsed!' });

  }

  downloadTemplate(): void {
    const fileName = `Batch_Template.xls`;
    const data: any[] = [];
    const columns: string[] = ['Request', 'CreditParty Key', 'CreditParty Value', 'DebitParty Key', 'DebitParty Value', 'SubType', 'Payment Mode', 'Currency', 'Amount', 'Description'];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {header: columns});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'batches');
    XLSX.writeFile(wb, fileName);
  }

  sendData(): void {
    const institutionId: string = this.createBatchForm.value.institutionId;
    const programId: string = this.createBatchForm.value.programId;
    const correlationID: string = uuid.v4();

    const payload = `${correlationID}:${this.settingsService.tenantIdentifier}:${JSON.stringify(this.batchInstructions)}`;
    const hashSHA3_256: any = sha3_256(payload);
    console.log(environment.backend.signatureBatchKey.replace(/\\n/g, '\n'));
    const rsa = Forge.pki.publicKeyFromPem(environment.backend.signatureBatchKey.replace(/\\n/g, '\n'));
    const signature: string = window.btoa(rsa.encrypt(hashSHA3_256));
    console.log(signature); 

    this.batchesService.createBatch(correlationID, institutionId, programId, signature, payload).subscribe((response: any) => {
      console.log(response);
    });
  }

  clearData(): void {
    this.batchInstructions = [];
    this.dataSource = new MatTableDataSource(this.batchInstructions);
    this.totalRows = 0;
    this.files = [];
    this.createBatchForm.patchValue({'programId': ''});
    this.createBatchForm.markAsUntouched();
  }
}
