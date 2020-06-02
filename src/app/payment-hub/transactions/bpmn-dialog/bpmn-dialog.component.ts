/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
