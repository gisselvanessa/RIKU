
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  //set the base url from environment
  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //tis function is used to reset the password
  changePassword(data: any): Observable<any> {
    return this.http.put<any>(environment.apiURL + '/users/change-password', data);
  }


  changeAdminPassword(data: any): Observable<any> {
    return this.http.put<any>(environment.apiURL + '/admin/change-password', data);
  }

}
