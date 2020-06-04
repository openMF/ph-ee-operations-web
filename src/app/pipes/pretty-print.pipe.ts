import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyPrint'
})
export class PrettyPrintPipe implements PipeTransform {

  transform(val: any) {
    return JSON.stringify(val, undefined, 4)
      .replace(/\\\\n|\\\\r|\\\\t/g, '<br/>')
      .replace(/\\\\\\"/g, '"')
      .replace(/\\\"/g, '"')
      .replace(/\\\"/g, '"')
      .replace(/ /g, '\u00a0')
      .replace(/\"/g, '');
  }

}
