import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { FindPipe } from './find.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, FindPipe],
  providers: [StatusLookupPipe, FindPipe],
  exports: [StatusLookupPipe, FindPipe]
})
export class PipesModule { }
