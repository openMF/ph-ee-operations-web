import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';
import { PrettyPrintPipe } from './pretty-print.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe, PrettyPrintPipe],
  providers: [StatusLookupPipe, FindPipe, PrettyPrintPipe],
  exports: [StatusLookupPipe, FindPipe, PrettyPrintPipe]
})
export class PipesModule { }
