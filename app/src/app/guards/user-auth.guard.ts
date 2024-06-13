import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private userService: UserService, private router: Router) {
  
    }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isSignedin() !== true) {
      this.authService.changeLoggedIn(false);
    } else if (this.userService.getUserType() != 'user') {
      this.authService.changeLoggedIn(true);
      this.router.navigate([`/${this.userService.getUserType()}`]);
    } else {
      this.authService.changeLoggedIn(true);
    }
    return true;
  }
}
