import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

declare var window: any;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  @Output() isUserLoggedIn: EventEmitter<any> = new EventEmitter();

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setAccessTokenStorage(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  removeAccessToken() {
    this.isUserLoggedIn.emit(false);
    this.loggedIn.next(false);
    localStorage.removeItem('access_token');
  }

  isSignedin(): boolean {
    const token = this.getAccessToken();
    return token !== null ? true : false;
  }

  public register(data: any) {
    return this.http.post(`${environment.apiURL}/register`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verify_mobile(data: any) {
    return this.http.post(`${environment.apiURL}/verification/verify-mobile`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendVerificationCode(data: any) {
    return this.http.post(`${environment.apiURL}/verification/send-verification-code`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeMobileNumberUser(data: any) {
    return this.http.post(`${environment.apiURL}/change/number`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verifyOtpForgotpassword(data: any) {
    return this.http.post(`${environment.apiURL}/verification/verify-forgot-otp`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  homePageDetails() {
    return this.http.get(`${environment.apiURL}/static/page/home`)
  }

  homePageWithProgress() {
    return this.http.get(`${environment.apiURL}/static/page/home`, {reportProgress: true, responseType: 'json'})
  }

  aboutUsPage() {
    return this.http.get(`${environment.apiURL}/static/page/about-us`)
  }

  getProvinceList(): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/vehicle/info/location/provinces`
    );
  }
  
  getVehiclesByRoleId(roleId: number): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/buyer/vehicles/info-by-role/${roleId}`
    );
  }

  getModelList(page: number=1, limit: number=20) {
    return this.http.get(`${environment.apiURL}/vehicle/info/models?page=${page}&limit=${limit}`)
  }

  wantToSellPage() {
    return this.http.get(`${environment.apiURL}/static/page/seller/home`)
  }

  changeLoggedIn(isLoggedIn: boolean) {
    // const currentDomain = window.location.hostname;
    // if (currentDomain == "rikusa.com") {
    //   this.router.navigate(["/coming-soon"]);
    // }
    this.loggedIn.next(isLoggedIn);
  }

  uploadDealerDocuments(uploadUrl: string, file: any): Observable<any> {
    return this.http.put<any>(uploadUrl, file);
  }

  getPreSignedUrl(data: any): Observable<any> {
    return this.http.get<any>(environment.apiURL + `/assets/get/dealer/presigned-url`,{ params: data });
  }

  getSuggestedUserNames(data: any) {
    return this.http.post(`${environment.apiURL}/usernames`, data);
  }

  checkUserExist(data: any) {
    return this.http.post(`${environment.apiURL}/check/username`, data);
  }

  getUserDataFromToken(token: string | null) {
    return this.http.get<any>(environment.apiURL + `/users/profile?token=${token}`);
  }
}
