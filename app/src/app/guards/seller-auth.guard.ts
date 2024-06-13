import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Observable, of } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SellerAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private userService: UserService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isSignedin() !== true) {
      this.authService.changeLoggedIn(false);
      this.router.navigate(['admin/login']);
    } else if (this.userService.getUserType() != 'seller') {
      this.authService.changeLoggedIn(true);
      this.router.navigate([`/${this.userService.getUserType()}`]);
    } else {
      this.authService.changeLoggedIn(true);
    }
    return true;
  }
}
