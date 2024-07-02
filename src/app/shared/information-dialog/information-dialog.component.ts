import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mifosx-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent implements OnInit {

  title: string;
  content: string;
  buttonText: string;

  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data.title;
        this.content = data.content;
        this.buttonText = data.buttonText;
    }

  ngOnInit() {
  }

}
