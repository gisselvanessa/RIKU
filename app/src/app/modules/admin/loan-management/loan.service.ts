import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class LoanService {


  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to get loan list
  public getLoanList(params: any) {
    return this.http.get<any>(`${this.baseURL}/admin/loans`, { params: params });
  }

  //this is used to get loan details
  public getLoanDetails(loanId: string) {
    return this.http.get<any>(`${this.baseURL}/admin/loans/${loanId}`);
  }

  //this is used to approve or reject applicant document
  public approveRejectDocument(data: any) {
    return this.http.post<any>(`${this.baseURL}/admin/loans/documents`, data);
  }

  //this is used to approve or reject applicant document
  public deleteLoan(loanId: string) {
    return this.http.delete<any>(`${this.baseURL}/admin/loans/${loanId}`);
  }


  //send loan details to lenderer
  public sendToLenderer(data: any) {
    return this.http.post<any>(`${this.baseURL}/admin/loans/bank`, data);
  }
}
