import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealerProfileService {

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('access_token') as string;

  getDealerDetails(userId: string) {
    return this.http.get<any>(`${environment.apiURL}/dealer/profile?dealer_id=${userId}`);
  }
  getVehicleList(userId: string, filter: any) {
    return this.http.get<any>(
      `${environment.apiURL}/dealer/profile/vehicles?dealer_id=${userId}`, { params: filter },
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


}
