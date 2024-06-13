import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ManageExpertsService } from './manage-experts.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Error } from 'src/app/shared/models/error.model';



@Injectable({ providedIn: 'root' })
export class OrdersResolver implements Resolve<any> {
  limit: number;
  constructor(private exxpertsService: ManageExpertsService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    if (window.innerWidth < 768) {
      this.limit = 10
    } else {
      this.limit = 15;
    }
  }

  resolve(): Observable<any> {
    return this.exxpertsService.getExpertList({ status: 'IN_PROGRESS', page: 1, limit: this.limit}).pipe(catchError((error:HttpErrorResponse) => {
      this.toastr.error(error.error.error[0]);
      this.router.navigate(['/admin/users']);
      return EMPTY;
    }));
  }
}
