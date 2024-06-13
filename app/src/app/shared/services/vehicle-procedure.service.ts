import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleProcedureResponse } from '../component/add-update-vehicle-procedure/vehicle-procedure.model';

@Injectable({
  providedIn: 'root'
})

export class VehicleProcedureService {
  constructor(
    protected http: HttpClient
  ) { }

  uploadDocuments(data: any){
    return this.http.post<any>(environment.apiURL + `/vps/assets`, data);
  }

  getVehicleProcedureDetails(vehicleProcedureId: string){
    return this.http.get<VehicleProcedureResponse>(environment.apiURL + `/vps/${vehicleProcedureId}`);
  }

  deleteDocument(data: any){
    return this.http.delete<any>(environment.apiURL + `/vps/assets`, {body: data});
  }

  confirmPayment(data: any){
    return this.http.post<any>(environment.apiURL + `/vps/payment`,  data);
  }

  cancelProcedure(data: any){
    return this.http.post<any>(environment.apiURL + `/vps/cancel`,  data);
  }
}
