import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to get FAQ's list
  public getFAQList(params: any) {
    return this.http.get<any>(`${this.baseURL}/faq`, {params:params});
  }

}
