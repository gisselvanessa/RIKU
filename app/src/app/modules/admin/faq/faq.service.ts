import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to get FAQ's list
  public getFAQList(params: any) {
    return this.http.get<any>(`${this.baseURL}/admin/faq`, {params:params});
  }

  //this is used to add FAQ
  public addFAQ(params: any) {
    return this.http.post<any>(`${this.baseURL}/admin/faq`, params);
  }

  //this is used to get FAQ
  public getFAQ(id: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/faq/${id}`)
  }

  //this is used to update FAQ
  public updateFAQ(updatedDetails: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/faq`, updatedDetails)
  }

  //this is used to delete FAQ
  public deleteFAQ(id: any) {
    return this.http.delete<any>(`${environment.apiURL}/admin/faq/${id}`)
  }



}
