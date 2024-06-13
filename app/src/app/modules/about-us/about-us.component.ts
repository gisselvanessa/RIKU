import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import SwiperCore, { Navigation } from "swiper";

import { Error } from 'src/app/shared/models/error.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit {

  //thumbsSwiper: any;
  //user: any;
  loading: boolean = true;
  //page: number = 1;
  //limit: number;
  //next: boolean = false;
  //previous: boolean = false;
  //getScreenWidth: any;
  aboutUsPageDetails: any;

  // pagination = {
  //   clickable: true,
  //   render: function (index: any, className: any) {
  //     return '<span class="' + className + '">' + (index + 1) + "</span>";
  //   },
  // };
  isAdmin: boolean = false;
  constructor(private authService: AuthService, private userService: UserService,
    private toastr: ToastrService, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    const isSignIn = this.authService.isSignedin();
    this.authService.changeLoggedIn(isSignIn);
    localStorage.removeItem('vehicleObj');
    const userType = this.userService.getUserType();
    this.isAdmin = userType == 'admin' || userType == 'super_admin' ? true : false;
    this.authService.aboutUsPage().subscribe({
      next: (resp: any) => {
        this.aboutUsPageDetails = resp.data ? resp.data : {}
      },
      error: (errorRes:Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translateService.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }

}
