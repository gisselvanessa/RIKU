import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpertsService {

  constructor(private http: HttpClient) { }

  public getCompanyList(params: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/expert/appointments`, { params: params });
  }



  postScheduleAppointment(appointmentDetails: any) {
    return this.http.post(`${environment.apiURL}/admin/expert/schedule-meeting`, appointmentDetails)
  }

  getAppointmentDetails(expertReviewId: any) {
    return this.http.get(`${environment.apiURL}/expert-reviews/${expertReviewId}`)
  }

  getAppraisalDetails(expertReviewId: any) {
    return this.http.get(`${environment.apiURL}/expert-reviews/appraisal-reports/${expertReviewId}`)
  }

  postAppraisalDetails(appraisalDetails: any) {
    return this.http.post(`${environment.apiURL}/expert-reviews/appraisal-reports`, appraisalDetails)
  }

  getExpertUserDetails(expertUserId: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/experts/${expertUserId}`)
  }

  getAdditionalAnnexPreSignedUrl(data: any){
    return this.http.get<any>(environment.apiURL + `/assets/expert/appraisal-report`,
    {
        params: data
    });
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

  uploadFile(url: string, file:any){
    return this.http.put<any>(url, file);
  }
}
