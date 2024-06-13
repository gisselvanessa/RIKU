import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

environment;

@Injectable({
  providedIn: 'root',
})
export class DealerVehiclesService {

  constructor(private http: HttpClient) {
  }

  postDealerAddVehicle(vehicle_data: any): Observable<any> {
    return this.http.post<any>(
      environment.apiURL + '/dealer/vehicles',
      vehicle_data
    );
  }

  updateDealerVehicle(vehicle_data: any): Observable<any> {
    return this.http.put<any>(
      environment.apiURL + '/dealer/vehicles',
      vehicle_data
    );
  }

  getVehicle(vehicle_id: any): Observable<any> {
    return this.http.get<any>(
      environment.apiURL + '/dealer/vehicles/' + vehicle_id
    );
  }

  getAllVehicle(filter: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/dealer/vehicles', {
      params: filter,
    });
  }

  deleteVehicle(id: any): Observable<any> {
    return this.http.delete<any>(environment.apiURL + '/dealer/vehicles/' + id);
  }

}
