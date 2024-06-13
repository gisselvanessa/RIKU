import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AddVehicleService {
  public isVehicleMakeChanged = new BehaviorSubject<string>('');
  vehicleMakeDetail = this.isVehicleMakeChanged.asObservable();
  public isVehicleDeleted = new BehaviorSubject<boolean>(false);
  getDeleteVehicle = this.isVehicleDeleted.asObservable();
  public vehicleBaseData: any;

  constructor(private http: HttpClient) {
  }

  getVehicleTypes() {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/types`
    );
  }

  getMake(vehicle_id: any) {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/makes`, { params: vehicle_id }
    );
  }

  getMakeYears(make_id: any) {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/make/years?makeId=${make_id}`
    );
  }

  getModels(make_id: any, year?: any) {
    if (year) {
      return this.http.get(
        `${environment.apiURL}/vehicle/info/make/models?makeId=${make_id}&year=${year}`
      );
    } else {
      return this.http.get(
        `${environment.apiURL}/vehicle/info/make/models?makeId=${make_id}`
      );
    }

  }

  getBodyType(): Observable<any> {
    return this.http.get(`${environment.apiURL}/vehicle/info/body-types`);
  }

  postSellerAddVehicle(vehicle_data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/seller/vehicles', vehicle_data);
  }

  updateSellerVehicle(vehicle_data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/seller/vehicles', vehicle_data);
  }

  getVehicle(vehicle_id: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/seller/vehicles/' + vehicle_id);
  }


  getPreSignedUrl(data: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + `/assets/get/presigned-url`, { params: data });
  }

  getAllVehicle(filter: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/seller/vehicles', { params: filter });
  }

  deleteVehicle(id: any): Observable<any> {
    return this.http.delete<any>(environment.apiURL + '/seller/vehicles/' + id);
  }

  uploadImage(uploadUrl: string, file: any): Observable<any> {
    return this.http.put<any>(uploadUrl, file);
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

  getYear(make_id: any): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/make/years?makeId=${make_id}`
    );
  }

  changeVehicle(vehicleMakeModelData: any) {
    this.vehicleBaseData = vehicleMakeModelData;
    this.isVehicleMakeChanged.next(vehicleMakeModelData);
  }
}
