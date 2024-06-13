import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
// import { OrderStatsAPIResponse, UserStatsAPIResponse } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})

export class DealerDashboardService {

  constructor(private http: HttpClient) { }



  public getCustomerStats(params: any) {
    return this.http.get<any>(`${environment.apiURL}/dealer/dashboard/user-stats`, { params: params });
  }

  public getVehicleStats(params: any) {
    return this.http.get<any>(`${environment.apiURL}/dealer/dashboard/vehicle-stats`, { params: params });
  }

  public getTotalEarnings(params: any) {
    return this.http.get<any>(`${environment.apiURL}/dealer/dashboard/earnings`, { params: params });
  }
}
