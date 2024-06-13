import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucWords'
})
export class UCWordsPipe implements PipeTransform {

  transform(value: any): string {
    if(value){
      return value.toString().replace(/(^|\/|-|,)(\S)/g, (s: string) => s.toUpperCase());
    }
    return '';
  }
}
