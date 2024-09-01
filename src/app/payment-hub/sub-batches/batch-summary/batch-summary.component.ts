import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
@Component({
  selector: 'mifosx-batch-summary',
  templateUrl: './batch-summary.component.html',
  styleUrls: ['./batch-summary.component.scss']
})
export class BatchSummaryComponent {
  batch: any;

  constructor(
    public dialogRef: MatDialogRef<BatchSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.batch = data.batch;
  }
}
