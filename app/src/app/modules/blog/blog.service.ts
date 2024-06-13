import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  public isblogDeleted = new BehaviorSubject<any>(false);
  getDeletedBlog = this.isblogDeleted.asObservable();

  getBlogList(params: any) {
    return this.http.get<any>(`${environment.apiURL}/blogs`, { params: params })
  }

  public getBlogDetails(id: any) {
    return this.http.get<any>(`${environment.apiURL}/blogs/${id}`)
  }

}
