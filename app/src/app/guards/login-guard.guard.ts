import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private injector: Injector, private router: Router, private activatedRoute: ActivatedRoute,) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isSignedin() == true) {
      const activatedRoute = this.injector.get(ActivatedRoute);
      this.authService.changeLoggedIn(true)
      this.router.navigate(["/home"], { relativeTo: activatedRoute });
    } else {
      this.authService.changeLoggedIn(false);
    }
    return true;
  }

}
