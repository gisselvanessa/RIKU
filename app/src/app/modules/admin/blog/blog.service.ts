import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlogDetailResponse, BlogListResponse } from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  public isblogDeleted = new BehaviorSubject<any>(false);
  getDeletedBlog = this.isblogDeleted.asObservable();

  getBlogList(params: any) {
    return this.http.get<BlogListResponse>(`${environment.apiURL}/admin/blogs`, { params: params })
  }

  public addBlog(data: any) {
    return this.http.post<any>(`${environment.apiURL}/admin/blogs`, data);
  }

  public getBlogDetails(id: string) {
    return this.http.get<BlogDetailResponse>(`${environment.apiURL}/admin/blogs/${id}`)
  }

  public updateBlogDetails(updatedDetails: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/blogs`, updatedDetails)
  }

  public deleteBlog(id: any) {
    return this.http.delete<any>(`${environment.apiURL}/admin/blogs/${id}`)
  }

  public publish(params: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/blogs/status`,params)
  }
}
