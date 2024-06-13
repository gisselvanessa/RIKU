import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router: Router){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isSignedin() !== true) {
      this.authService.changeLoggedIn(false);
      window.alert('Access Denied, Login is Required to Access This Page!');
      this.router.navigate(['auth/login']);
    }else{
      this.authService.changeLoggedIn(true);
    }
    return true;
  }

}
