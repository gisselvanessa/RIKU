import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  forgotPassword(data:any){
    return this.http.post(`${environment.apiURL}/forgot-password`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  forgotAdminPassword(data:any){
    return this.http.post(`${environment.adminApiURL}/forgot-password`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
