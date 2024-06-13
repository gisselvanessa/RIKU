import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.scss'],
})
export class VehicleSummaryComponent implements OnInit {
  @Input() vehicleData: any;
  @Input() dni: any;

  userDetails: UserDetails;
  profileForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
  });
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }
  getUserInfo() {
    this.userService.getMyProfileDetails().subscribe((resp: any) => {
      this.userDetails = resp.data;
      this.profileForm.patchValue(this.userDetails);
      const fullAdrees =
        this.userDetails.address.address +
        ' ' +
        this.userDetails.address.city +
        ' ' +
        this.userDetails.address.province +
        ' ' +
        this.userDetails.address.parish;
      this.profileForm.controls['address'].setValue(fullAdrees);
      this.profileForm.controls['mobile'].setValue(this.userDetails.mobile_no.toString());
    });
  }
}
