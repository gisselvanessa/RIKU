import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { RolesService } from './roles.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Injectable({ providedIn: 'root' })
export class RolesResolver implements Resolve<any> {
  limit: number;
  constructor(private rolesService: RolesService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    if (window.innerWidth < 768) {
      this.limit = 10
    } else {
      this.limit = 15;
    }
  }

  resolve(): Observable<any> {
    return this.rolesService.getRoleList({ page: 1, limit: this.limit, sortBy:'created_at', sortOrder:'DESC' }).pipe(catchError(() => {
      this.toastr.error(this.translate.instant('You are not authorized to access this module'));
      this.router.navigate(['/admin/users']);
      return EMPTY;
    }));
  }
}
