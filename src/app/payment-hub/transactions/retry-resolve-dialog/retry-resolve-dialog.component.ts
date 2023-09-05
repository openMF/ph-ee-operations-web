/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';


@Component({
  selector: 'mifosx-retry-resolve-dialog',
  templateUrl: './retry-resolve-dialog.component.html',
  styleUrls: ['./retry-resolve-dialog.component.scss']
})
export class RetryResolveDialogComponent implements OnInit {

  workflowInstanceKey: any;
  action: string;

  constructor(public dialogRef: MatDialogRef<RetryResolveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.workflowInstanceKey = data.workflowInstanceKey;
    this.action = data.action;
  }

  ngOnInit() {
  }

  takeAction() {
    // TODO: Send request to api with workflowInstanceKey by defining a function in transaction service when api is available
    if (this.action === 'retry') {
      this.dialogRef.close();
    } else if (this.action === 'resolve') {
      this.dialogRef.close();
    }
  }
}