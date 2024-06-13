import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class VehicleDetailsService {

  constructor(private http: HttpClient) { }

  token = localStorage.getItem('access_token') as string;

  getVehicleDetails(vehicleId:string) {
    const headers = new HttpHeaders()
  .set('Authorization',this.token);
    return this.http.get(
      `${environment.apiURL}/seller/vehicles/${vehicleId}`,
      { 'headers': headers }
    );
  }

}
