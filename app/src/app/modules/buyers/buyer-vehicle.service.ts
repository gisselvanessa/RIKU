import { Injectable } from '@angular/core';
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BuyerVehicleService {

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('access_token') as string;
  connection: any;

  getAllVehicle(filter: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/buyer/vehicles',
      { params: filter });
  }

  getVehicleTypes() {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/types`
    );
  }
  getAllMake() {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/makes`
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

  getBodyType(vehicleTypeId: any) {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/body-types?vehicleTypeId=${vehicleTypeId}`
    );
  }

  getProvinceList(): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/location/provinces`
    );
  }

  getYear(make_id: any): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/make/years?makeId=${make_id}`
    );
  }

  postFavouriteVehicle(id: any) {
    return this.http.post(`${environment.apiURL}/buyer/favourite/vehicles`, { vehicle_id: id }
    )
  }

  getFavouriteVehicle() {
    return this.http.get(`${environment.apiURL}/buyer/favourite/vehicles`
    )
  }

  deletFavouriteVehicle(id: any) {
    return this.http.delete(`${environment.apiURL}/buyer/favourite/vehicles/${id}`
    )
  }


  getMyProfileDetails() {
    return this.http.get(`${environment.apiURL}/users/view-profile`)
  }

  acceptTermsConditions(type: any) {
    return this.http.post(`${environment.apiURL}/user/tnc-status`, type)
  }

  getTermsAndConditionData(type: string, userId: any) {
    return this.http.get(`${environment.apiURL}/user/tnc-status?type=${type}&seller_id=${userId}`)
  }

  getTermsandConditions(typeOfPolicies: any) {
    return this.http.get(`${environment.apiURL}/content/static?type=${typeOfPolicies}`)
  }

  searchVehicle(filter: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/buyer/vehicles',
      { params: filter }).pipe(map((response) => response.data.items));
  }


}
