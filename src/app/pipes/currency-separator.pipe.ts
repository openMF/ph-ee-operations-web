import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySeparator'
})
export class CurrencySeparatorPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) {
      return '';
    }

    let stringValue = value.toString();
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}