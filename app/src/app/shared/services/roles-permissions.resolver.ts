import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/operators';
import { UserPermissionService } from './user-permission.service';
import { UserService } from './user.service';


@Injectable({ providedIn: 'root' })

export class RolesPermissionsResolver implements Resolve<any> {

    constructor(private userPermissionService: UserPermissionService, private router: Router,
      private toastr: ToastrService, private userService: UserService) {
    }

    resolve() {
      return this.userPermissionService.getUserPermissions().pipe(
        catchError((error:HttpErrorResponse) => {
          this.toastr.error(error.error.error[0]);
          this.router.navigate(['/admin/login']);
          return EMPTY;
        }));
    }

}
