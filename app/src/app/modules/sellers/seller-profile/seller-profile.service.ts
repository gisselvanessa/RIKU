import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SellerProfileService {

  constructor(private http: HttpClient) { }

  token = localStorage.getItem('access_token') as string;
  getSellerDetails(userId: string) {
    const headers = new HttpHeaders()
      .set('Authorization', this.token);
    return this.http.get<any>(
      `${environment.apiURL}/seller/profile?seller_id=${userId}`,
      { 'headers': headers }
    );
  }

  getVehicleList(userId: string, filter: any) {
    return this.http.get<any>(
      `${environment.apiURL}/seller/profile/vehicles?seller_id=${userId}`, { params: filter },
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

  
}
