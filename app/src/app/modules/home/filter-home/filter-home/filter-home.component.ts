import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import SwiperCore, { Navigation } from 'swiper';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { BuyerVehicleService } from 'src/app/modules/buyers/buyer-vehicle.service';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-filter-home',
  templateUrl: './filter-home.component.html',
  styleUrls: ['./filter-home.component.scss'],
})
export class FilterHomeComponent implements OnInit {
  page: number = 1;
  getScreenWidth: any;
  loading: any = true;
  modelList: Array<any> = [];
  makeList: Array<any> = [];
  yearList: Array<any> = [];
  modelListClone: Array<any> = [];
  makeListClone: Array<any> = [];
  yearListClone: Array<any> = [];
  totalModelPages: number = 1;
  currentPage: number = 1;
  homePageDetails: any;
  limit: any;
  searchData: any = {};
  province: any;
  selectedProvince: any;
  vehicleProvinceClone: any;
  selectedModel: any;
  selectedMake: any;
  selectedYear: any;
  pagination = {
    clickable: true,
    render: function (index: any, className: any) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private buyerService: BuyerVehicleService
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    const isSignIn = this.authService.isSignedin();
    this.authService.changeLoggedIn(isSignIn);
    localStorage.removeItem('vehicleObj');
    const userType = this.userService.getUserType();
    this.isAdmin =
      userType == 'admin' || userType == 'super_admin' ? true : false;
    this.authService.homePageDetails().subscribe({
      next: (resp: any) => {
        this.homePageDetails = resp.data;
        this.getProvince();
        this.getModels();
        this.getMakes();
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      },
    });
  }
  getYears(makeId) {
    this.buyerService.getYear(makeId).subscribe((res: any) => {
      this.yearList = res.data.years;
    });
  }
  getMakes() {
    this.buyerService.getAllMake().subscribe((data: any) => {
      this.makeList = data.data;
      this.makeListClone = data.data;
    });
  }
  searchInput(event: any, filterKey: string) {
    if (filterKey == 'location') {
      this.province = this.vehicleProvinceClone;
      if (event.target.value != '') {
        this.province = this.vehicleProvinceClone.filter(
          (x: any) =>
            x.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.province = this.vehicleProvinceClone;
      }
    } else if (filterKey == 'model') {
      if (event.target.value != '') {
        this.modelList = this.modelListClone.filter(
          (x: any) =>
            x.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.modelList = Object.assign([], this.modelListClone);
      }
    } else if (filterKey == 'make') {
      if (event.target.value != '') {
        this.makeList = this.makeListClone.filter(
          (x: any) =>
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.makeList = Object.assign([], this.makeListClone);
      }
    } else if (filterKey == 'year') {
      if (event.target.value != '') {
        this.yearList = this.yearListClone.filter(
          (x: any) =>
            x.years.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.yearList = Object.assign([], this.yearListClone);
      }
    }
  }

  search() {
    if (this.selectedModel != null) {
      for (let i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].model == this.selectedModel) {
          this.searchData.models = this.modelList[i].id;
        }
      }
    }
    if (this.selectedMake != null) {
      for (let i = 0; i < this.makeList.length; i++) {
        if (this.makeList[i].make == this.selectedMake) {
          this.searchData.name = this.modelList[i].id;
        }
      }
    }
    if (this.selectedProvince != null) {
      this.searchData.location = this.selectedProvince;
    }
    this.searchData.page = this.page;
    this.searchData.limit = this.limit;
    localStorage.setItem('searchData', JSON.stringify(this.searchData));
    setTimeout(() => {
      const isSignIn = this.authService.isSignedin();
      if (isSignIn) {
        const userType: any = this.userService.getUserType();
        this.router.navigate([`/${userType}/vehicles`]);
      } else {
        this.router.navigate([`/buyer/vehicles`]);
      }
    }, 500);
  }

  public getProvince() {
    this.authService.getProvinceList().subscribe(
      (res: any) => {
        this.province = res.data;
        this.vehicleProvinceClone = res.data;
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(
            this.translate.instant(
              'Something Went Wrong Please Try again later'
            )
          );
        }
      }
    );
  }

  public getModels(curreentPage = 1) {
    this.loading = true;
    this.authService.getModelList(curreentPage, this.limit).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.data && res.data.items) {
          res.data.items.forEach((item) => {
            this.modelList.push(item);
            this.modelListClone.push(item);
          });
          this.totalModelPages = res.data.pagination.total_pages;
          this.currentPage = curreentPage;
        }
        // this.modelList = res.data ? res.data : [];
        // this.modelListClone = res.data ? res.data : [];
      },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(
            this.translate.instant(
              'Something Went Wrong Please Try again later'
            )
          );
        }
      }
    );
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
}
