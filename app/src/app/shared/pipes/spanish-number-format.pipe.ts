import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: 'spanishNumber' })

export class SpanishNumber implements PipeTransform {

  constructor() { }
  transform(value: any, ...args: any[]): any {
    if (typeof value == 'number' && !isNaN(value)) {
      let number: any = value;
      if (Number.isInteger(value)) {
        // number = value.toFixed(2);
        number = Intl.NumberFormat("es", {
          minimumFractionDigits: 2
        }).format(number);
      }
      else {
        number = number.toFixed(2);
        number = Intl.NumberFormat("es", {
          minimumFractionDigits: 2
        }).format(number);
      }
      return number;
    } else if(value) {
      return  Intl.NumberFormat("es", {
        minimumFractionDigits: 2
      }).format(value);
    }
  }
}
