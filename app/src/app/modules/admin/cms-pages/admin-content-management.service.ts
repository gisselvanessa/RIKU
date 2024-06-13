import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminContentManagementService {

  constructor(private http: HttpClient) { }

  public postContentDetails(contentData: any) {
    return this.http.post<any>(`${environment.apiURL}/admin/static/content`, contentData)
  }

  public getContentDetails(type: string) {
    return this.http.get<any>(`${environment.apiURL}/admin/content/static?type=${type}`)
    // return this.http.get<any>(`${environment.apiURL}/admin/content/static?type=privacy_policy`)
  }

  public saveHomePageContent(pageContent: any){
    return this.http.post<any>(`${environment.apiURL}/admin/static/page/home`, pageContent)
  }

  public saveWantToSellPageContent(pageContent: any){
    return this.http.post<any>(`${environment.apiURL}/admin/static/page/seller/home`, pageContent)
  }

  homePageDetails(){
    return this.http.get(`${environment.apiURL}/admin/static/page/home`)
  }

  aboutUsPage(){
    return this.http.get(`${environment.apiURL}/admin/static/page/about-us`)
  }
  postAboutUsPage(data:any){
    return this.http.post(`${environment.apiURL}/admin/static/page/about-us`,data)
  }

  wantToSellPage(){
    return this.http.get(`${environment.apiURL}/admin/static/page/seller/home`)
  }
}
