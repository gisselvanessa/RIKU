import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { VehicleListResponse } from './models/vehicle.model';


@Injectable({
  providedIn: 'root'
})

export class AdminVehicleService {

  public isVehicleDeleted = new BehaviorSubject<boolean>(false);
  getDeletedVehicleStatus = this.isVehicleDeleted.asObservable();

  constructor(private http: HttpClient) {
  }

  public getVehicleDetails(vehicleId: string) {
    return this.http.get<any>(`${environment.adminApiURL}/vehicles/${vehicleId}`);
  }

  public getVehicleList(params: any) {
    return this.http.get<VehicleListResponse>(`${environment.adminApiURL}/vehicles`, { params: params });
  }

  public approveDisaproveVehicle(data: any) {
    return this.http.post<any>(`${environment.adminApiURL}/vehicles/change-status`, data);
  }

  public deleteVehicle(vehicleId: string) {
    return this.http.delete<any>(`${environment.adminApiURL}/vehicles/${vehicleId}`);
  }

  public getVehicleListByTab(params: any) {
    return this.http.get<any>(`${environment.adminApiURL}/vehicles`, { params: params });
  }

}
