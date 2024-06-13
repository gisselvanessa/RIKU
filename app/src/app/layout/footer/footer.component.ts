import { Component, Input, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { ComingSoonComponent } from 'src/app/shared/modals/coming-soon/coming-soon.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  @Input() userType: string;
  @Input() isLoggedIn: boolean;
  constructor(
    public router: Router,
    private modalService:NgbModal,
    private authService:AuthService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    console.log(this.router)
  }

  //this function is used to open comming soon modal
  comingSoon(){
    const modalRef = this.modalService.open(ComingSoonComponent, {
      windowClass: 'delete-vehicle-modal'
    })
  }

  //this function is used to navigate footer link to respective pages
  navigateOnLink(url){
    if(this.authService.isSignedin()){
      this.router.navigate([url]);
    }else{
      this.navigateToLogin();
    }
  }

  //this function is used to redirect user to vehicle list page as per their role type
  viewVehicle(){
    if (this.authService.isSignedin()) {
      if (this.userType === 'buyer') {
        this.router.navigate(['/buyer/vehicles/buyer-vehicle-list']);
      } else if (this.userType === 'seller') {
        this.router.navigate(['/seller/vehicles/vehicle-list']);
      } else if (this.userType === 'dealer') {
        this.router.navigate(['/dealer/vehicles/vehicle-list']);
      }
    } else {
      this.router.navigate(['/buyer/vehicles/buyer-vehicle-list']);
    }
  }

  //this function is used to redirect user to login page
  navigateToLogin(){
    this.router.navigate(['/auth/login']);
  }
}
