import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminVehicleProcedureService {

  public baseURL:string = environment.apiURL;

  constructor(private http: HttpClient) { }

  //this is used to get companies list
  public getCompanyList(params: any) {
    return this.http.get<any>(`${this.baseURL}/vps`, { params: params });
  }

  //this function is used to call add company
  public addCompany(data: any) {
    return this.http.post<any>(`${this.baseURL}/admin/company`, data);
  }

  //this function is used to delete the user
  public deleteCompany(userId: string) {
    return this.http.delete<any>(`${this.baseURL}/admin/companies/${userId}`)
  }

  //this is used to get vehicle procedure data
  public getVehicleProcedureData(id: any) {
    return this.http.get<any>(`${this.baseURL}/vps/${id}`, { });
  }

  //this is used to get vehicle procedure data
  public markAsComplete(data: any) {
    return this.http.post<any>(`${this.baseURL}/admin/vps/mark-as-completed`, data);
  }

  getVPSPreSignedUrl(data: any){
    return this.http.get<any>(environment.apiURL + `/assets/vps`,
    {
        params: data
    });
  }

  uploadFile(url: string, file:any){
    return this.http.put<any>(url, file);
  }

  //this is used to get vehicle procedure data
  public submitASsets(data: any) {
    return this.http.post<any>(environment.apiURL + `/vps/assets`, data);
  }
}
