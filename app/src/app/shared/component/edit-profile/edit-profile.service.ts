import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(private http: HttpClient) { }

  //this function is used to update profile
  public updateUser(data: any) {
    return this.http.post<any>(`${environment.apiURL}/users/profile`, data);
  }

  // when user is get username list when user is buyer or seller. not applicable for dealer
  public getSuggestedUserNames(data: any) {
    return this.http.post(`${environment.apiURL}/usernames`, data);
  }

  //this function is used to check the selected username is matched with existing or not
  public checkUserExist(data: any) {
    return this.http.post(`${environment.apiURL}/check/username`, data);
  }

  //this function is used ton remove profile picture
  public removeProfileImage(){
    return this.http.delete(`${environment.apiURL}/user/profile/picture`);
  }

  getProvinceList(): Observable<any> {
    return this.http.get(`${environment.apiURL}/vehicle/info/location/provinces`);
  }

  getCityList(province: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/vehicle/info/location/cities?province=${province}`);
  }

  getParishList(city: string): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/location/parishes?city=${city}`
    );
  }
}
