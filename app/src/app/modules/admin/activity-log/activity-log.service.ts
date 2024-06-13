import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  constructor(private http:HttpClient) { }



  public getActivityLogList(params: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/activity/log`, { params: params });
  }
}
