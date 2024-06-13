import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BuyerVehicleService } from '../../buyer-vehicle.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-terms-conditions-chat-call',
  templateUrl: './terms-conditions-chat-call.component.html',
  styleUrls: ['./terms-conditions-chat-call.component.scss']
})

export class TermsConditionsChatCallComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private buyerService: BuyerVehicleService,
    private toastr: ToastrService, private translate: TranslateService) { }
  @Input() typeOfContact: string;
  @Input() userType: string;
  @Input() userId: string;
  isTermsAccepted: any = "false";
  @Input() showTermsAndConditions: boolean = true;
  @Input() isWarning = false;


  ngOnInit(): void {
    this.isTermsAccepted = this.showTermsAndConditions ? "false" : 'true';
  }

  sendTermsResponse(e: any) {
    this.isTermsAccepted = (e.target.checked).toString()
  }

  proceed() {
    if (this.typeOfContact === 'Chat') {
      if (this.isTermsAccepted === 'true') {
        this.buyerService.acceptTermsConditions({ type: 'chat', seller_id: this.userId }).subscribe((resp: any) => {
          this.activeModal.dismiss('proceed')
        })
      } else if (this.isTermsAccepted === 'false') {
        this.toastr.error(this.translate.instant('please accept the terms and conditions to proceed'))
      }
    } else if (this.typeOfContact === 'Call') {
      if (this.isTermsAccepted === 'true') {
        this.buyerService.acceptTermsConditions({ type: 'call', seller_id: this.userId }).subscribe((resp: any) => {
          this.activeModal.dismiss('proceed')
        })
      } else if (this.isTermsAccepted === 'false') {
        this.toastr.error(this.translate.instant('please accept the terms and conditions to proceed'))
      }
    }
  }

  redirectToChat(){
    this.activeModal.dismiss('proceed');
  }


}
