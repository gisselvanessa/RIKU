import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor( protected http: HttpClient,) { }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(environment.adminApiURL + '/reset-password', data);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(environment.adminApiURL + '/login', user);
  }

  logout(): Observable<any> {
    return this.http.delete(environment.adminApiURL + '/logout').pipe(
    );
  }

  forgetPass(email: string): Observable<any> {
    return this.http.post(environment.adminApiURL + '/api/password/email', email);
  }

  rememberAdmin(data: any){
    localStorage.setItem('remember_admin', JSON.stringify(data));
  }

  getRememberAdmin(){
    const admin = localStorage.getItem('remember_admin');
    return admin ? JSON.parse(admin) : false;
  }

  removeRememberAdmin(){
    const admin = localStorage.getItem('remember_admin');
    if(admin){
      localStorage.removeItem('remember_admin');
    }
  }

}
