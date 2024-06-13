import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PostAPIResponse } from 'src/app/shared/models/post-api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoanProcedureService {

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('access_token') as string;
  connection: any;

  currentLoan: any;

  public loanList(selectedStatus: string, params: any) {
    return this.http.get(`${environment.apiURL}/buyer/loans?status=${selectedStatus}&limit=${params.limit}&page=${params.page}`)
  }

  getFavouriteVehicle() {
    return this.http.get(`${environment.apiURL}/buyer/favourite/vehicles`
    )
  }

  public loanDetails(id: string) {
    return this.http.get(`${environment.apiURL}/buyer/loans/${id}`)
  }
  public postLoanDetails(data: any) {
    return this.http.post(`${environment.apiURL}/buyer/loans`, data)
  }
  public patchLoanDetails(data: any) {
    return this.http.patch(`${environment.apiURL}/buyer/loans`, data)
  }

  public getCurrentLoan() {
    return this.currentLoan;
  }

  public setCurrentLoan(loanDetail: any) {
    this.currentLoan = Object.assign({}, loanDetail);
  }

  cancelLoan(id: any) {
    return this.http.delete(`${environment.apiURL}//buyer/loans/${id}`
    )
  }

  deletFavouriteVehicle(id: any) {
    return this.http.delete(`${environment.apiURL}/buyer/favourite/vehicles/${id}`
    )
  }

  postFavouriteVehicle(id: any) {
    return this.http.post(`${environment.apiURL}/buyer/favourite/vehicles`, { vehicle_id: id }
    )
  }


  getPreApproval(data: any) {
    return this.http.post(`${environment.apiURL}/buyer/loans`, data)
  }

  verifyCedulaId(data: any) {
    return this.http.post(`${environment.apiURL}/buyer/loans/verify-cedula-id`, data)
  }

  uploadDocuments(data: any) {
    return this.http.post<PostAPIResponse>(`${environment.apiURL}/buyer/loans/documents`, data)
  }

  deleteDocument(data: any) {
    return this.http.delete<any>(environment.apiURL + `/buyer/loans/documents`, { body: data });
  }

  setLoanForOrder(orderId: string){
    return this.http.post(`${environment.apiURL}/buyer/orders/loan`, {order_id: orderId});
  }
}
