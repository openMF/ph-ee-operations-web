import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { ExternalIdentifierPipe } from './external-identifier.pipe';
import { FormatNumberPipe } from './format-number.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe],
  providers: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, DecimalPipe],
  exports: [StatusLookupPipe, FindPipe, DateFormatPipe, ExternalIdentifierPipe, FormatNumberPipe]
})
export class PipesModule { }
