import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-buyer-call',
  templateUrl: './buyer-call.component.html',
  styleUrls: ['./buyer-call.component.scss']
})
export class BuyerCallComponent implements OnInit {

  callObject: any = {};

  constructor(
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.callObject.caller_id = this.userService.getUserId();
    this.callObject.receiver_id = this.userService.callingDetails?.id;
    this.callObject.receiver_role_type = this.userService.callingDetails?.type;
    this.callObject.number = this.userService.callingDetails?.country_code+ this.userService.callingDetails?.mobile_no;
    this.callObject.first_name = this.userService.callingDetails?.first_name;
    this.callObject.last_name = this.userService.callingDetails?.last_name;
    this.callObject.profile_pic = this.userService.callingDetails?.profile_pic;
  }

  disconnectCall(call:any){
  }

}
//token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJyb2xlcyI6WyJidXllciIsInNlbGxlciJdLCJjdXJyZW50X3JvbGUiOiJidXllciIsImlhdCI6MTY5NTM2MDU1NiwiZXhwIjoxNjk1NDQ2OTU2fQ.HAAHVo-K5noOPKqChz-cc70W1gl8g2f2BXtA-UBB_rA&id=adb459a0-bc5b-4cdc-9a74-340711c84cd8&first_name=Rajat&last_name=Seller&country_code=+91&profile_img=https://jakay-dev.s3.amazonaws.com/undefined&mobile_no=8320046045&type=seller&caller_id=4d5e25ad-05cc-488e-938d-b1c4940b7a76

