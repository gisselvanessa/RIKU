import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(private http: HttpClient) { }

  public isRoleDeleted = new BehaviorSubject<any>({});
  getDeleteRole = this.isRoleDeleted.asObservable();

  public getUserList(params: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/users`, { params: params });
  }

  public addUser(data: any) {
    return this.http.post<any>(`${environment.apiURL}/admin/users`, data);
  }

  public updateUser(data: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/users`, data);
  }

  public getUser(userId: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/users/${userId}`)
  }

  public deleteUser(userId: any, type: any) {
    if (type.length > 1) {
      return this.http.delete(`${environment.apiURL}/admin/users?user_id=${userId}&type[0]=${type[0]}&type[1]=${type[1]}`)
    } else if (type.length = 1) {
      return this.http.delete(`${environment.apiURL}/admin/users?user_id=${userId}&type[0]=${type[0]}`)
    }
    return;
  }

  public updateStatus(changedStatus: any) {
    let params = {
      user_id: changedStatus.user_id,
      active: changedStatus.active,
      type: changedStatus.type
    }
    return this.http.patch(`${environment.apiURL}/admin/users`, params)
  }

  public getSuggestedUserNames(data: any) {
    return this.http.post(`${environment.apiURL}/usernames`, data);
  }

  public checkUserExist(data: any) {
    return this.http.post(`${environment.apiURL}/check/username`, data);
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
