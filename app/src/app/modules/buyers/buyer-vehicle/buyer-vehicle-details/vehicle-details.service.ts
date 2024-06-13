import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ReplaySubject } from 'rxjs';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailsService {

  constructor(private http: HttpClient) { }

  public vehicleId = new ReplaySubject<any>();
  public vehicleId$ = this.vehicleId.asObservable();

  token = localStorage.getItem('access_token') as string;

  public currentVehicle: VehicleDetail;

  getVehicleDetails(vehicleId: string) {
    return this.http.get(`${environment.apiURL}/buyer/vehicles/${vehicleId}`);
  }

  postBuyerAsSeller(vehicleTypes: any) {
    return this.http.post(`${environment.apiURL}/become/seller`, { vehicle_types: vehicleTypes })
  }

  publishVehicleId(id: any) {
    this.vehicleId.next(id)
  }

  postFavouriteVehicle(id: any) {
    return this.http.post(`${environment.apiURL}/buyer/favourite/vehicles`, { vehicle_id: id })
  }

  getFavouriteVehicle() {
    return this.http.get(`${environment.apiURL}/buyer/favourite/vehicles`)
  }

  deletFavouriteVehicle(id: any) {
    return this.http.delete(`${environment.apiURL}/buyer/favourite/vehicles/${id}`)
  }
}
