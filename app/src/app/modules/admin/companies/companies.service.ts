import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CompanyAdded, CompanyDeleted, CompanyList, NewCompany } from './companies.model';
@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to get companies list
  public getCompanyList(params: any) {
    return this.http.get<CompanyList>(`${this.baseURL}/admin/companies`, { params: params });
  }

  //this function is used to call add company
  public addCompany(data: NewCompany) {
    return this.http.post<CompanyAdded>(`${this.baseURL}/admin/company`, data);
  }

  //this function is used to delete the user
  public deleteCompany(userId: string) {
    return this.http.delete<CompanyDeleted>(`${this.baseURL}/admin/companies/${userId}`)
  }

}
