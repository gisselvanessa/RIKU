import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  constructor(private http: HttpClient) { }


  public getAdminProfileDeatils() {
    return this.http.get<any>(`${environment.apiURL}/admin/profile`)
  }


  public updateAdminProfile(data: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/profile`, data)
  }

  //this function is used ton remove profile picture
  public removeProfileImage(){
    return this.http.delete(`${environment.apiURL}/admin/profile/picture`);
  }
}
