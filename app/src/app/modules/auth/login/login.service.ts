import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor( protected http: HttpClient,protected cookieService:CookieService) { }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/reset-Password', data);
  }
  sendLinkOTP(data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/verification/send-verification-code', data);
  }
  rememberUser(data: any){
    this.cookieService.set('remember_user', JSON.stringify(data));
    //sessionStorage.setItem('remember_user', JSON.stringify(data));
  }
  getRememberUser(){
    const admin = this.cookieService.get('remember_user'); 
    //sessionStorage.getItem('remember_user');
    return admin ? JSON.parse(admin) : false;
  }

  removeRememberUser(){
    const admin = this.cookieService.get('remember_user');
    if(admin){
      this.cookieService.delete('remember_user');
    }
  }
}
