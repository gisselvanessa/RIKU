import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TwilioService } from './twilio.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class UserService {
  callingDetails:any;
  userType: string = 'guest';
  userDetails: any;
  userId: string;
  userProfileImage:string | null;
  private profilePicChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public notificationUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readNotification: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public notificationCountUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fullName: string;
  private fullNameChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userEmail: string;
  private userEmailChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFromMobile: boolean = false;
  private typeOfUser: BehaviorSubject<any> = new BehaviorSubject<any>('guest');
  
  constructor(private router: Router, private http: HttpClient, private twilioService: TwilioService) { }

  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
    this.userId = userId;
    this.twilioService.connect();
  }

  setUserType(userType: string) {
    localStorage.setItem('userType', userType);
    this.userType = userType;

    this.typeOfUser.next(userType);
  }

  setTypeOfUser(userType: string) {
    this.typeOfUser.next(userType);
  }

  get isProfilePicChanged() {
    return this.profilePicChanged.asObservable();
  }

  changeProfilePic(profilePicChanged: boolean){
    this.profilePicChanged.next(profilePicChanged);
  }

  setUserProfileImage(userProfileImage: string){
    localStorage.setItem('userProfileImage',userProfileImage);
    this.userProfileImage = userProfileImage;
    this.profilePicChanged.next(true);
  }

  removeUserProfileImage(){
    localStorage.removeItem('userProfileImage');
    this.userProfileImage = null;
    this.profilePicChanged.next(true);
  }

  get isFullNameChanged() {
    return this.fullNameChanged.asObservable();
  }

  setUserFullName(fullName: string){
    localStorage.setItem('user_full_name',fullName);
    this.fullName = fullName;
    this.fullNameChanged.next(true);
  }

  getUserFullName(){
    const userFullName = localStorage.getItem('user_full_name');
    if(userFullName){
      this.fullName = userFullName;
    }
    return this.fullName;
  }

  get isEmailChanged() {
    return this.userEmailChanged.asObservable();
  }

  setUserEmail(userEmail: string) {
    localStorage.setItem('email', userEmail);
    this.userEmail = userEmail;
    this.userEmailChanged.next(true);
  }

  getUserEmail() {
    const userEmail = localStorage.getItem('email');
    if(userEmail){
      this.userEmail = userEmail;
    }
    return this.userEmail;
  }

  getUserId() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userId = userId;
    }
    return this.userId
  }

  getUserProfileImage(){
    const userProfileImage = localStorage.getItem('userProfileImage');
    if(userProfileImage){
      this.userProfileImage = userProfileImage;
    }
    return this.userProfileImage
  }

  getUserType() {
    const userType = localStorage.getItem('userType');
    if (userType) {
      this.userType = userType;
    }
    return this.userType;
  }

  setUserDetails(userDetails: any) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.userDetails = userDetails;
  }

  updateUserDetails(userDetails: any) {
    localStorage.removeItem('userDetails');
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.userDetails = userDetails;
  }

  clearUserDetails() {
    localStorage.removeItem('userDetails');
    this.userDetails = null;
  }

  getUserDetails() {
    if (this.userDetails) {
      return this.userDetails;
    } else {
      const userDetails = localStorage.getItem('userDetails');
      if (userDetails) {
        this.userDetails = JSON.parse(userDetails);
      }
      return this.userDetails;
    }
  }

  navigateAsPerUserType(totalVehicles: number = 0) {
    this.updateNotificationList(true);
    if (this.userType == 'admin' || this.userType == 'super_admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.userType == 'seller') {
      if (totalVehicles > 0) {
        this.router.navigate(['seller/vehicles/vehicle-list']);
      } else if (totalVehicles === 0) {
        this.router.navigate(['seller/vehicles/add-vehicle'])
      }
    } else if (this.userType == 'user') {
      this.router.navigate(['user/vehicles/buyer-vehicle-list']);
    }else if (this.userType == 'buyer') {
      this.router.navigate(['buyer/vehicles/buyer-vehicle-list']);
    } else if (this.userType == 'dealer') {
      this.router.navigate(['dealer/dashboard']);
    } else if(this.userType == 'expert'){
      this.router.navigate(['/expert/appointments'])
    }
  }

  getMyProfileDetails() {
    return this.http.get(`${environment.apiURL}/users/view-profile`)
  }

  //this function is used to redirect user profile
  redirectToProfile(){
    const userType:string = this.getUserType();
    if(userType === 'dealer'){
      this.router.navigate(['/dealer/my-profile']);
    }else if(userType === 'user'){
      this.router.navigate(['/user/my-profile']);
    }else if(userType === 'seller'){
      this.router.navigate(['/seller/my-profile']);
    }else{
      this.router.navigate(['/admin/view-profile']);
    }
  }

  get updateNotification() {
    return this.notificationUpdate.asObservable();
  }

  updateNotificationList(userLoggedIn: boolean){
    this.notificationUpdate.next(userLoggedIn);
  }

  postSellerAsBuyer() {
    return this.http.get(`${environment.apiURL}/become/user`)
  }

  postBuyerAsSeller() {
    return this.http.post(`${environment.apiURL}/become/seller`,{})
  }

  getTypeOfUser(): Observable<any> {
    return this.typeOfUser.asObservable();
  }
}
