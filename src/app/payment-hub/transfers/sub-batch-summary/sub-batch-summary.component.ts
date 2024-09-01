import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'

@Component({
  selector: 'mifosx-sub-batch-summary',
  templateUrl: './sub-batch-summary.component.html',
  styleUrls: ['./sub-batch-summary.component.scss']
})
export class SubBatchSummaryComponent {

  subBatch: any;

  constructor(
    public dialogRef: MatDialogRef<SubBatchSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.subBatch = data.subBatch;
      console.log(this.subBatch)
  }
}