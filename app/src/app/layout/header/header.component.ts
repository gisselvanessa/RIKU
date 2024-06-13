import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { AdminService } from 'src/app/modules/admin/admin-login/admin.service';
import { BuyerVehicleService } from 'src/app/modules/buyers/buyer-vehicle.service';
import { ComingSoonComponent } from 'src/app/shared/modals/coming-soon/coming-soon.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { CancelLoanDialogComponent } from 'src/app/modules/loan-procedure/cancel-loan-dialog/cancel-loan-dialog.component';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { BecomeBuyerSellerComponent } from 'src/app/shared/modals/become-buyer-seller/become-buyer-seller.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  // auth:any = localStorage.getItem('access_token');
  @Input() isLoggedIn: boolean = false;
  @Input() userType: string;
  collapsed = true;
  auth: any;
  userProfileImage: string | null;
  fullName: string;
  userEmail: string;
  newNotificationCount = 0;
  searching: boolean;
  searchFailed: boolean;
  loggedInUserType: string = '';
  userDetails: UserDetails;
  becomeType: string;

  constructor(public router: Router, public authService: AuthService, private buyerVehicleService: BuyerVehicleService,
    private tokenService: TokenService, private adminService: AdminService, private translate: TranslateService,
    public userService: UserService, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userProfileImage = this.userService.getUserProfileImage();
    this.fullName = this.userService.getUserFullName();
    this.userEmail = this.userService.getUserEmail();
    this.userService.isProfilePicChanged.subscribe(isChanged => {
      if (isChanged) {
        setTimeout(() => {
          this.userProfileImage = this.userService.getUserProfileImage();
          this.fullName = this.userService.getUserFullName();
          this.userEmail = this.userService.getUserEmail();
        }, 1000);
      }
    });

    this.loggedInUserType = this.userService.getUserType();
    this.userService.setTypeOfUser(this.loggedInUserType);

    this.userService.getTypeOfUser().subscribe((value: any) => {
      this.loggedInUserType = value;
      this.userService.getMyProfileDetails().subscribe((resp: any) => {
        this.userDetails = resp.data;
      });
    });
  }

  myFavourites() {
    this.router.navigate(['/buyer/buyer-favourite'])
  }

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      if (term && term.length >= 3) {
        this.searching = true;
        let ob = this.buyerVehicleService.getAllVehicle({
          search: term,
          page: 1,
          limit: 20
        })
        if (ob == undefined) {
          this.searching = false;
          ob = Observable.create((observer: Observer<Object>) => {
            observer.next([]);
            observer.complete();
          })
        }
        return ob.pipe(
          map(response => {
            this.searching = false
            if (response.data.items.length == 0)
              return [{ canonicalName: 'no_result' }]

            return response.data.items;
          })
        ).pipe(
          catchError(err => {
            this.searching = false;
            this.toastr.error('Something went wrong, Please try again');
            return of([]);
          })
        )
      } else {
        this.searching = false;
        return of([]);
      }
    })
  )

  comingSoon() {
    const modalRef = this.modalService.open(ComingSoonComponent, {
      windowClass: 'delete-vehicle-modal'
    })
  }

  navigateToListing() {
    const isSignIn = this.authService.isSignedin();
    if (isSignIn) {
      const userType: any = this.userService.getUserType();
      this.router.navigate([`/${userType}/vehicles`]);
    } else {
      this.router.navigate([`/buyer/vehicles`])
    }
  }

  sendItToFinancing() {
    const isSignIn = this.authService.isSignedin();
    if (isSignIn) {
      // const userType: any = this.userService.getUserType();
      // if(userType == 'buyer'){
      this.router.navigate([`/loan/financing`]);
      // }else{

      // }
    } else {
      this.toastr.error(this.translate.instant('Please sign in to check the eligibility'))
      this.router.navigate([`/auth/login`])
    }
  }

  logout() {
    const userType = this.userService.getUserType();
    if (userType == 'admin' || userType == 'super_admin' || userType == 'expert') {
      this.authService.removeAccessToken();
      const isRememberMe = this.adminService.getRememberAdmin();
      localStorage.clear();
      this.router.navigate(['/admin/login']);
      isRememberMe ? this.adminService.rememberAdmin(isRememberMe) : false;
    } else {
      this.tokenService.logout().subscribe((res) => {
        this.authService.removeAccessToken();
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      });
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  getCount($event: number) {
    this.newNotificationCount = $event;
  }

  showVehicleDetails(vehicle: any) {
    this.router.navigate([`/user/my-vehicles/vehicle-details/${vehicle.id}`]);
  }

  /**
 * vehicleFormatter - operator function called when vehicle selected from dropdown
 */
  vehicleFormatter = (x: string) => {
    return '';
  }

  openBseller(type: any) {
    this.becomeType = type;
    const modalRef = this.modalService.open(BecomeBuyerSellerComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.becomeType = this.becomeType;
    modalRef.result.then().catch((res: any) => {
      if (res) {
        this.userService.getMyProfileDetails().subscribe((resp: any) => {
          this.userType = resp.data.role.map((x: any) => x.type);
          this.userDetails = resp.data;
        });
      }
    })
  }
}
