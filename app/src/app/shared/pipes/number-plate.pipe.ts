import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPlate'
})
export class NumberPlatePipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    if(value){
      let plate = value?.split('-');
      let letter1 = '';
      let letter2 = '';
      if(plate.length > 0){
        letter1 = plate[0][0] + "*".repeat(plate[0].length - 1);
        letter2 = "*".repeat(plate[1]?.length - 1) + plate[1]?.slice(-1);
      }
      return letter1 + '-' + letter2;
    }else{
      return '';
    }
  }

}
