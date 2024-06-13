import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PostAPIResponse } from 'src/app/shared/models/post-api-response.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ManageExpertsService {

  public isExpertDeleted = new BehaviorSubject<any>(false);
  getDeletedExpert = this.isExpertDeleted.asObservable();

  public baseURL:string = environment.adminApiURL;

  constructor(private http: HttpClient) { }

  public getExpertList(params: any){
    return this.http.get<any>(`${environment.adminApiURL}/experts`, {params: params})
  }

  public addExpert(data: any){
    return this.http.post<PostAPIResponse>(`${environment.adminApiURL}/experts`, data)
  }

  public updateExpert(data: any){
    return this.http.put<PostAPIResponse>(`${environment.adminApiURL}/experts`, data)
  }

  public getExpertPresignedUrl(data: any){
    return this.http.get<any>(`${environment.apiURL}/assets/expert/document/presigned-url`, {params:data})
  }

  getExpertUserDetails(expertUserId:any){
    return this.http.get<any>(`${environment.apiURL}/admin/experts/${expertUserId}`)
  }

  public activateDeactivateExpert(status: any) {
    return this.http.patch(`${environment.apiURL}/admin/experts`, status)
  }

  public deleteExpert(id: any) {
    return this.http.delete<any>(`${environment.apiURL}/admin/experts/${id}`)
  }

   //this function is used ton remove profile picture
   public removeExpertImage(){
    return this.http.delete(`${environment.apiURL}/admin/profile/picture`);
  }

  getProvinceList(): Observable<any> {
    return this.http.get(`${environment.apiURL}/vehicle/info/location/provinces`);
  }

  getCityList(province: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/vehicle/info/location/cities?province=${province}`);
  }

  getParishList(city: string): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/location/parishes?city=${city}`
    );
  }
}
