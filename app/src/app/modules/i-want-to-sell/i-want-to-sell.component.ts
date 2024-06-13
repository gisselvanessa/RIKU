import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import SwiperCore, { Navigation } from "swiper";


SwiperCore.use([Navigation]);

@Component({
  selector: 'app-i-want-to-sell',
  templateUrl: './i-want-to-sell.component.html',
  styleUrls: ['./i-want-to-sell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IWantToSellComponent implements OnInit {

  thumbsSwiper: any;
  user: any;
  loading: any = true;
  page: any = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  homePageDetails: any;


  pagination = {
    clickable: true,
    render: function (index: any, className: any) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };
  isAdmin: boolean = false;
  swiperBrand: any = {
    slidesPerView: 5,
    speed: 1000,
    direction: 'horizontal',
    mousewheel:
    {
      invert: true,
    },
    breakpoints: {
      '0': {
        slidesPerView: 1,

      },
      '576': {
        slidesPerView: 2,

      },
      '768': {
        slidesPerView: 3,

      },
      '1200': {
        slidesPerView: 5,

      }
    },
    autoplay:
    {
      delay: 2000,
    },
    loop: false,
  }
  swiperReview: any = {
    breakpoints: {
      '0': {
        slidesPerView: 1,

      },
      '576': {
        slidesPerView: 2,

      },
      '991': {
        slidesPerView: 3,

      }

    },
    loop: false,
  }
  constructor(private authService: AuthService, private router: Router, private translate: TranslateService,
    private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const isSignIn = this.authService.isSignedin();
    this.authService.changeLoggedIn(isSignIn);
    localStorage.removeItem('vehicleObj');
    const userType = this.userService.getUserType();
    this.isAdmin = userType == 'admin' || userType == 'super_admin' ? true : false;

    this.authService.wantToSellPage().subscribe({
      next: (resp: any) => {
        this.homePageDetails = resp.data ? resp.data : {}
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    })
  }


  navigateToSellPage() {
    const userType = this.userService.getUserType();
    if (userType === 'user') {
      const isSignIn = this.authService.isSignedin();
      if (isSignIn) {
        this.router.navigate(['user/vehicles/add-vehicle'])
      } else {
        this.router.navigate(['/auth/login'])
      }
    } else {
      localStorage.clear()
      this.toastr.error(this.translate.instant('Login to sell the vehicle'))
      this.router.navigate(['/auth/login'])
    }

  }
}
