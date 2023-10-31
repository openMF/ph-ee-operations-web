import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mifosxAutoFormatDateTime]'
})
export class AutoFormatDateTimeDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 4) {
      value = value.replace(/(\d{4})(\d{0,2})/, '$1-$2');
    }
    if (value.length > 7) {
      value = value.replace(/(\d{7})(\d{0,2})/, '$1-$2');
    }
    if (value.length > 10) {
      value = value.replace(/(\d{10})(\d{0,2})/, '$1 $2');
    }
    if (value.length > 13) {
      value = value.replace(/(\d{13})(\d{0,2})/, '$1:$2');
    }
    if (value.length > 16) {
      value = value.replace(/(\d{16})(\d{0,2})/, '$1:$2');
    }

    input.value = value;
  }
}
