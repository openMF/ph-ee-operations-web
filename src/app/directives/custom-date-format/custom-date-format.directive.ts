import { Directive } from "@angular/core";
import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats } from '@angular-material-components/datetime-picker';

const ISO_8601_DATE_FORMAT = 'YYYY-MM-DD';

const DATE_FORMAT: NgxMatDateFormats = {
  parse: {
    dateInput: ISO_8601_DATE_FORMAT
  },
  display: {
    dateInput: ISO_8601_DATE_FORMAT,
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Directive({
  selector: '[customDateFormat]',
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: DATE_FORMAT},
  ],
})
export class CustomDateFormat {
}