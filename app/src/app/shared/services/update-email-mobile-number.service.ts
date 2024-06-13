import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UpdateEmailMobileNumberService {

  //set the base url from environment
  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this function is used to reset the email or mobile number
  sendOTP(data: any){
    return this.http.post<any>(environment.apiURL + '/user/verification', data);
  }

  //this function is used to sent otp
  verifyOTP(data: any){
    return this.http.post<any>(environment.apiURL + '/user/verify', data);
  }


  sendAdminOTP(data: any){
    return this.http.post<any>(environment.apiURL + '/admin/verification', data);
  }

  //this function is used to sent otp
  verifyAdminOTP(data: any){
    return this.http.post<any>(environment.apiURL + '/admin/verify', data);
  }

}
