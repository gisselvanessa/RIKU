import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

export class DateHelper {
    public static getNextYear() {
        let nextYear;
        return nextYear = new Date().getFullYear() + 1
    }

    public static getData() {
      let nextYear;
      return nextYear = new Date().getFullYear() + 1
  }
}


export function getDateDiffInDays(dataFrom: any, dateTo: any, isAppendString: boolean = false): string | number {
  dataFrom = new Date(dataFrom);
  dateTo = new Date(dateTo);
  const diffTime = Math.abs(dateTo - dataFrom);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if(isAppendString){
    return diffDays > 1 ? diffDays + ' Days' : 1 + ' Day';
  }
  return diffDays > 0 ? diffDays : 1;
}


export function getBSConfig(): any{
  return Object.assign({}, { containerClass: 'theme-dark-blue' , adaptivePosition: true });
}



export function getFormatedDate(dateString: string){
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const datePart: any = dateString.match(/\d+/g),
  year = datePart[0], // get only two digits
  month = datePart[1], day = datePart[2];
  return day+'-'+ monthNames[parseInt(month)-1] +'-'+year;
}
