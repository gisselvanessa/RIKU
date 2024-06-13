import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  constructor(
    protected http: HttpClient,
  ) { }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/login', user);
  }

  logout(): Observable<any> {
    return this.http.get(environment.apiURL + '/logout');
  }

  forgetPass(email: string): Observable<any> {
    return this.http.post(environment.apiURL + '/api/password/email', email);
  }

  unsubscribe(payload: any): Observable<any> {
    return this.http.post(environment.apiURL + '/api/candidate-unsubscribe', payload);
  }
}
