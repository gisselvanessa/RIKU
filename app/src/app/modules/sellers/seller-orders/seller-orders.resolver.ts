import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SellerOrdersService } from './seller-orders.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SellerOrdersResolver implements Resolve<any> {
  limit: number;
  constructor(private sellerOrdersService: SellerOrdersService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    if (window.innerWidth < 768) {
      this.limit = 10
    } else {
      this.limit = 20;
    }
  }

  resolve(): Observable<any> {
    return this.sellerOrdersService.getOrderList({ status: 'IN_PROGRESS', page: 1, limit: this.limit}).pipe(catchError((error:HttpErrorResponse) => {
      this.toastr.error(error.error.error[0]);
      this.router.navigate(['/admin/users']);
      return EMPTY;
    }));
  }
}
