import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'mifosx-app-radiobuttonboolean',
  template: `
<div class="demo-full-width margin-top" [formGroup]="group">
<label class="radio-label-padding">{{field.label}}:</label>
<mat-radio-group [formControlName]="field.name">
<mat-radio-button [value]="true">Yes</mat-radio-button>
<mat-radio-button [value]="false">No</mat-radio-button>
<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-radio-group>
</div>
`,
  styles: []
})
export class RadiobuttonBooleanComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
