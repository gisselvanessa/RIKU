import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to add FAQ
  public submitQuery(params: any) {
    return this.http.post<any>(`${this.baseURL}/contact-us`, params);
  }
}
