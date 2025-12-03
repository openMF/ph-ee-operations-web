/** Angular Imports */
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef,MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

/** Custom Services */
import { AlertService } from 'app/core/alert/alert.service';

/** Custom Models */
import { BatchInstruction } from 'app/payment-hub/batches/model/batch.model';
import { VoucherInstruction } from 'app/vouchers/models/vouchers-model';

/** External Imports */
import * as XLSX from 'xlsx';


/** Upload Dialog Componenent */
@Component({
  selector: 'mifosx-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {

   /** Indicates whether the file processing is in progress */
   isLoading = false;

   /** List of uploaded files */
   files: File[] = [];
 
   /** Instructions for Voucher upload */
   voucherInstructions: VoucherInstruction[] = [];
 
   /** Event emitter to notify parent component of the imported data */
   @Output() importedData = new EventEmitter<any>();
 
   constructor(
     private alertService: AlertService,
     public dialogRef: MatDialogRef<UploadDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
   ) {}
 
   /**
    * Handles file selection, processes the file and closes the dialog.
    * @param file The selected file.
    */
   onFileChange(file: File): void {
     this.processFiles(file);
     this.dialogRef.close();
   }
 
   /**
    * Checks if a file has been added.
    * @returns True if files are present, otherwise false.
    */
   isFileAdded(): boolean {
     return this.files.length > 0;
   }
 
   /**
    * Processes the uploaded file, parses it, and emits the processed data.
    * @param file The file to process.
    */
   processFiles(file: File): void {
     this.isLoading = true;
     const reader: FileReader = new FileReader();
 
     // Read the file as an array buffer and process its contents
     reader.onload = (e: any) => {
       const data = new Uint8Array(e.target.result);
       const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
       const sheetName = workbook.SheetNames[0];
       const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
 
       // Extract and process data from the worksheet based on the type (Vouchers or Batches)
       const results: Array<VoucherInstruction | BatchInstruction> = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
 
       if (this.data.type === 'Vouchers') {
         this.voucherInstructions = results.slice(1).map((row: any) => ({
           instructionID: row[0],
           groupCode: row[1],
           currency: row[2],
           amount: row[3],
           expiry: row[4],
           payeeFunctionalID: row[5],
           narration: row[6] || null,
         }));
       }
 
       this.files.push(file);
 
       // Emit the processed data based on the type of file
        if (this.voucherInstructions.length > 0) {
         this.importedData.emit(this.voucherInstructions);
       }
 
       this.isLoading = false;
 
       // Notify the user of a successful file upload
       this.alertService.alert({ type: `${this.data.type} File Upload`, message: 'Successfully parsed!' });
     };
 
     reader.readAsArrayBuffer(file);
   }
 
   /**
    * Downloads the template file (for Vouchers or Batches) based on the provided column headers and file name.
    */
   downloadTemplate(): void {
     const fileName = this.data.fileName;
     const data: any[] = [];
     const columns: string[] = this.data.columns;
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: columns });
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, this.data.sheetName);
     XLSX.writeFile(wb, fileName);
   }
 }