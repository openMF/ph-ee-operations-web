import { Component, Inject } from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA  } from '@angular/material/legacy-dialog'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
@Component({
  selector: 'mifosx-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SuccessDialogComponent>) {
   }

   ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 2000); 
  }
}
