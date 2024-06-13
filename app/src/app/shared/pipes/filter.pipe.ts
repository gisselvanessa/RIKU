import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];

    if (!searchText) return items;

    if (searchText.toString().trim() == '') return items;

    return this.searchItems(items, searchText.toString().toLowerCase());
  }

  private searchItems(items: any[], searchText: string): any[] {
    let results: any = [];
    items.forEach((element) => {
      if(!items){
        results = [];
      }else if(!searchText || searchText.toString().trim() == ''){
        results = items;
      }else if (element.name) {
        element.name.toLowerCase().includes(searchText.toLowerCase()) ? results.push(element) : null;
      } else if (element.status) {
        element.status.toLowerCase() == searchText.toLowerCase() ? results.push(element) : null;
      } else if (element?.participant_2?.first_name || element?.participant_2?.last_name || element?.participant_1?.first_name || element?.participant_1?.last_name) {
        if (element.participant_2.first_name && element.participant_2.last_name) {
          const fullName = element.participant_2.first_name + ' ' + element.participant_2.last_name;
          fullName.toLowerCase().trim().includes(searchText.toLowerCase().trim()) ? results.push(element) : null
        } else if (element.participant_1.first_name && element.participant_1.last_name) {
          const fullName = element.participant_1.first_name + ' ' + element.participant_1.last_name;
          fullName.toLowerCase().trim().includes(searchText.toLowerCase().trim()) ? results.push(element) : null
        }else {
          element.participant_2.first_name.toLowerCase().includes(searchText.toLowerCase().trim()) || element.participant_2.last_name.toLowerCase().includes(searchText.toLowerCase().trim()) || element.participant_1.last_name.toLowerCase().includes(searchText.toLowerCase().trim()) || element.participant_1.last_name.toLowerCase().includes(searchText.toLowerCase().trim()) ? results.push(element) : null;
        }
      } else {
        if (isNaN(element)) {
          element.toString().toLowerCase().includes(searchText.toLowerCase()) ? results.push(element) : null;
        } else {
          element.toString().includes(searchText) ? results.push(element) : null;
        }
      }
    });
    return results;
  }
}
