import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

    //this is used to get notification list
    public getNotificationList(params: any) {
      return this.http.get<any>(`${this.baseURL}/notification`, { params: params });
    }

    //this is used to get Allow or stop notifications
    public allowNotification() {
      return this.http.get<any>(`${this.baseURL}/allow/notification/`);
    }

    //this is used to get read single/all notifications
    public readNotification(params: string) {
      return this.http.get<any>(`${this.baseURL}/notification/${params}`);
    }

    //this is used to get delete single/all notifications
    public deleteNotification(params: string) {
      return this.http.delete<any>(`${this.baseURL}/notification/${params}`);
    }

    //this is used to get notifications current status
    getNotificationStatus() {
      return this.http.get(`${environment.apiURL}/status/notification/`)
    }
}
