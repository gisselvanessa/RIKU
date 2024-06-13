import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


type Value = {
  [key: string]: {
    new: string | number | Array<any> | object;
    old: string | number | Array<any> | object;
  };
};

@Component({
  selector: 'app-updated-data',
  templateUrl: './updated-data.component.html',
  styleUrls: ['./updated-data.component.scss']
})


export class UpdatedDataComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private location: Location) { }
  dataObject: any;
  updatedDetailsId: any;
  updatedValue: Value;


  ngOnInit(): void {
    this.updatedDetailsId = this.activatedRoute.snapshot.paramMap.get('id') || undefined;
    this.dataObject = JSON.parse(localStorage.getItem('updatedDetails')!)
    for (let i = 0; i < this.dataObject.length; i++) {
      if (this.dataObject[i].id === this.updatedDetailsId) {
        this.updatedValue = this.flatterObject(this.dataObject[i].data)
        break;
      }

    }
  }

  flatterObject(obj: any) {
    let result: any = {};
    for (const key in obj) {
      if (typeof obj[key] !== 'object') {
        result[key] = obj[key];
      } else {
        if (Array.isArray(obj[key])) {
          result[key] = obj[key].toString();
        } else {
           if (Object.keys(obj[key]).includes('new') && obj[key]['new']) {
            if (typeof obj[key]['new'] !== 'object') {
              result[key] = {};
              result[key]['old'] = obj[key]['old'] ? obj[key]['old'] : '-';
              result[key]['new'] = obj[key]['new'];
            } else {
              if (Array.isArray(obj[key]['new'])) {
                result[key] = {};
                obj[key]['new'].forEach((myKey) => {
                  if (typeof myKey !== 'object') {
                    result[key]['old'] = obj[key]['old'] ? obj[key]['old'].toString() : '-';
                    result[key]['new'] = obj[key]['new'].toString();
                  }else{
                    const objectKeys = Object.keys(myKey);
                    if (objectKeys.length > 0) {
                      objectKeys.forEach((newKey) => {
                        if (!result[key]) {
                          result[key] = {};
                        }
                        if(!result[key]['new']){
                          result[key]['new'] = {};
                        }
                        if(!result[key]['old']){
                          result[key]['old'] = {};
                        }
                        result[key]['new'][newKey] = myKey[newKey];
                        result[key]['old'][newKey] = obj[key]['old'][0][newKey];
                      })
                    }
                  }
                })
              } else {
                const objectKeys = Object.keys(obj[key]['new']);
                if (objectKeys.length > 0) {
                  objectKeys.forEach((newKey) => {
                    if (!result[key]) {
                      result[key] = {};
                      result[key]['new'] = {};
                    }
                    if (typeof obj[key]['new'][newKey] !== 'object') {
                      result[key]['new'][newKey] = obj[key]['new'][newKey];
                    }
                  })
                }
              }
            }
          }
        }
      }
    }
    return result;
  }

  back() {
    this.location.back()
  }

  isObject(object: any) {
    if (typeof object === 'object') {
      return true
    } else {
      return false
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('updatedDetails')
  }

}
