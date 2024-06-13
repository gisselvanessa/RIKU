import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if(!items) return [];

    if(!searchText) return items;

    return this.searchItems(items, searchText.toString().toLowerCase());
   }

   private searchItems(items :any[], searchText: string): any[] {
      const results: any = [];
      items.forEach((element) => {
       if(element.name){
        element.name.toLowerCase().includes(searchText.toLowerCase()) ? results.push(element) : null;
       }else{
        if(isNaN(element)){
          element.toLowerCase().toString().includes(searchText.toLowerCase()) ? results.push(element) : null;
        }else{
          element.toString().includes(searchText) ? results.push(element) : null;
        }
       }
     });
     return results;
   }
}
