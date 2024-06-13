import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable,BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class VehicleMasterDataService {
  public isVehicleMakeChanged = new BehaviorSubject<string>('');
  vehicleMakeDetail = this.isVehicleMakeChanged.asObservable();
  public isVehicleDeleted = new BehaviorSubject<boolean>(false);
  getDeleteVehicle = this.isVehicleDeleted.asObservable();
  public vehicleBaseData: any;

  constructor(private http: HttpClient) {
  }

  getVehicleTypes() {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/types`
    );
  }

   getMake(vehicle_id: any) {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/makes?vehicleTypeId=${vehicle_id}`
    );
  }

  getMakeYears(make_id: any) {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/make/years?makeId=${make_id}`
    );
  }

  getModels(make_id: any, year?: any) {
    if(year){
      return this.http.get(
        `${environment.adminApiURL}/vehicle/info/make/models?makeId=${make_id}&year=${year}`
      );
    }else{
      return this.http.get(
        `${environment.adminApiURL}/vehicle/info/make/models?makeId=${make_id}`
      );
    }
  }

  getBodyType() {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/body-types`
    );
  }

  getProvinceList(): Observable<any> {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/location/provinces`
    );
  }

  getCityList(province: string): Observable<any> {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/location/cities?province=${province}`
    );
  }

  getParishList(city: string): Observable<any> {
    return this.http.get(
      `${environment.adminApiURL}/vehicle/info/location/parishes?city=${city}`
    );
  }
}
