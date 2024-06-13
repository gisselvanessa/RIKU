import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ExpertReviewService {
  currentExpertReview: any;
  constructor(
    protected http: HttpClient,
  ) { }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/login', user);
  }

  getPackages(): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/expert-reviews/packages');
  }

  selectExpertReviewPackage(data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/expert-reviews/select-package', data);
  }

  getExpertsList(params: any) {
    return this.http.get<any>(environment.apiURL + '/expert-reviews/experts', { params: params })
  }

  postContactInformation(contactInformation: any) {
    return this.http.post(environment.apiURL + '/expert-reviews/contact-details', contactInformation)
  }

  public makePayment(type: string, order_id: string) {
    const params = `type=${type}&expert_review_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/checkout?${params}`);
  }

  public getAccountDetails(type: string, order_id: string) {
    const params = `type=${type}&expert_review_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/payment/account?${params}`);
  }

  //this function is used to submit bank receipt
  public submitBankReceipt(data: any) {
    return this.http.post<any>(`${environment.apiURL}/expert-reviews/bank-receipt`, data);
  }

  //cancel order
  public cancelExpertReview(expert_review_id: any) {
    return this.http.delete<any>(`${environment.apiURL}/expert-reviews/${expert_review_id}`);
  }

  getUserDetails() {
    return this.http.get(`${environment.apiURL}/users/view-profile`)
  }

  postExpertDetails(expertData: any) {
    return this.http.post(`${environment.apiURL}/expert-reviews/select-expert`, expertData)
  }

  getSummaryDetails(expertReviewId: any) {
    return this.http.get(`${environment.apiURL}/expert-reviews/${expertReviewId}`)
  }

  setCurrentExpertReview(exoertReview: any) {
    this.currentExpertReview = exoertReview;
  }

  getCurrentExpertReview() {
    return this.currentExpertReview;
  }

  getVehicleByNumberPlate(numberPlate: string) {
    return this.http.get<any>(`${environment.apiURL}/vehicles/search?number_plate=${numberPlate}`)
  }

  getExpertReviewList(params: any) {
    return this.http.get<any>(`${environment.apiURL}/expert-reviews`, { params: params })
  }

  addVehicleInformation(data: any) {
    return this.http.post<any>(`${environment.apiURL}/expert-reviews/vehicle-details`, data)
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
