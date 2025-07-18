/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'mifosx-bpmn-dialog',
  templateUrl: './bpmn-dialog.component.html',
  styleUrls: ['./bpmn-dialog.component.scss']
})
export class BpmnDialogComponent implements OnInit {

  datasource: any;

  constructor(public dialogRef: MatDialogRef<BpmnDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { 
  	this.datasource = data.datasource;
  }

  ngOnInit() {
  }
}
