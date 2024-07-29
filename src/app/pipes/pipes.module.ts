import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';
import { PrettyPrintPipe } from './pretty-print.pipe';
import { CurrencySeparatorPipe } from './currency-separator.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe, PrettyPrintPipe, CurrencySeparatorPipe],
  providers: [StatusLookupPipe, FindPipe, PrettyPrintPipe, CurrencySeparatorPipe],
  exports: [StatusLookupPipe, FindPipe, PrettyPrintPipe, CurrencySeparatorPipe]
})
export class PipesModule { }
