import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'licensePlate'
})
export class LicensePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(value){
      let plate = value
      var letter1 = plate[0][0] + "*".repeat(plate[0].length);
      var letter2 = "*****".repeat(plate[1].length) + plate[1].slice(-1);
      return letter1  + letter2;
    }
  }

}
