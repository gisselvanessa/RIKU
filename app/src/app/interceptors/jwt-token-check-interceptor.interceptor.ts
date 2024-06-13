import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpContextToken, HttpContext, HttpResponse, HttpErrorResponse, HttpParams
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from "../shared/services/auth.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { UserService } from '../shared/services/user.service';
const SILENT = new HttpContextToken<boolean>(() => false);

export function silent() {
  return new HttpContext().set(SILENT, true);
}

@Injectable()
export class JwtTokenCheckInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private userService: UserService
              ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    if (token) {
      // If we have a token, we set it to the header
      if (request.url.includes('https://devjakapi.internetsoft.com') ||
        request.url.includes('https://qajakapi.internetsoft.com') ||
        request.url.includes('https://api.rikusa.com') ||
        request.url.includes('http://localhost')
      ) {
        request = request.clone({
          setHeaders: { Authorization: token }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if(err.error.error_code == "INVALID_TOKEN" || err.error.error_code == 'TOKEN_BLOCKED'){
            const type = this.userService.getUserType();
            localStorage.clear();
            if(type === 'admin' || type === 'super_admin' ){
              this.router.navigate(['/admin/login']);
            }else{
              this.router.navigate(['/auth/login']);
            }
          }
        }
        return throwError(err);
      })
    )
  }
}



