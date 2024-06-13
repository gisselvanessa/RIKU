import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { EarningStatsAPIResponse, OrderStatsAPIResponse, UserStatsAPIResponse, VehicleStatsAPIResponse } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  constructor(private http: HttpClient) { }

  public getUserStats(params: any) {
    return this.http.get<UserStatsAPIResponse>(`${environment.apiURL}/admin/dashboard/user-stats`, { params: params });
  }

  public getOrderStats(params: any) {
    return this.http.get<OrderStatsAPIResponse>(`${environment.apiURL}/admin/dashboard/order-stats`,  { params: params });
  }

  public getVehicleStats(params: any) {
    return this.http.get<VehicleStatsAPIResponse>(`${environment.apiURL}/admin/dashboard/vehicle-stats`,  { params: params });
  }

  public getTotalEarnings(params: any) {
    return this.http.get<EarningStatsAPIResponse>(`${environment.apiURL}/admin/dashboard/earnings`,  { params: params });
  }
}
