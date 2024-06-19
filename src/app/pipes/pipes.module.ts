import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { ExternalIdentifierPipe } from './external-identifier.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { DatetimeFormatPipe } from './datetime-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, DatetimeFormatPipe],
  providers: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, DecimalPipe, DatetimeFormatPipe],
  exports: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, DatetimeFormatPipe]
})
export class PipesModule { }
