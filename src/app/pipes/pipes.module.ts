import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';
import { PrettyPrintPipe } from './pretty-print.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { ExternalIdentifierPipe } from './external-identifier.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe, PrettyPrintPipe, DateFormatPipe, ExternalIdentifierPipe],
  providers: [StatusLookupPipe, FindPipe, PrettyPrintPipe, DateFormatPipe, ExternalIdentifierPipe],
  exports: [StatusLookupPipe, FindPipe, PrettyPrintPipe, DateFormatPipe, ExternalIdentifierPipe]
})
export class PipesModule { }
