import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http: HttpClient) { }

  public getContactUsList(params: any) {
    return this.http.get<any>(`${environment.adminApiURL}/contact-us`, { params: params })
  }

  public getContactUsDetails(id: any) {
    return this.http.get<any>(`${environment.adminApiURL}/contact-us/${id}`)
  }

  public sendMail(data: any) {
    return this.http.put<any>(`${environment.adminApiURL}/contact-us`, data)
  }
}
