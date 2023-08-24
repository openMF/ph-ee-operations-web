/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Delete dialog component.
 */
@Component({
  selector: 'mifosx-delete-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {any} data Provides a confirmContext.
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
