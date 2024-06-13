import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EditVehicleService {
  constructor(private http: HttpClient) {
  }

  getVehicle(vehicle_id:string) {
    return this.http.get(`${environment.apiURL}/seller/vehicles/${vehicle_id}`);
  }
}
