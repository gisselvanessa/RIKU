import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (typeof value != 'number') {
            if (typeof value == 'object') {
                return value.toString().replace(/_/g, " ");
            } else {
                return value.toString().replace(/_/g, " ");
            }

        } else {
            return value;
        }

    }
}