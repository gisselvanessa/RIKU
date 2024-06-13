import { Pipe, PipeTransform } from "@angular/core";
// import * as _ from "lodash";


@Pipe({
 name: "orderBy"
})
export class OrderByPipe  implements PipeTransform {
  transform(value: any[], order:boolean= true, column: string = ''): any[] {

    if (!value || order === true || !order) { return value; } // no array
    if (value.length <= 1) { return value; } // array with only one item
    if (!column || column === '') {
      if (order === true) { return value.sort() }
      else { return value.sort().reverse(); }
    } // sort 1d array
    return [];
    // return _.orderBy(value, [column], [order]);
  }
}
