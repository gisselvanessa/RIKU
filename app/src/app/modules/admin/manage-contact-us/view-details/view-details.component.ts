import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { ContactUsDetails } from '../contact-us.model';
import { ContactUsService } from '../contact-us.service';
import { SendEmailComponent } from '../send-email/send-email.component';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {

  constructor(private location: Location,private translate:TranslateService, private activateroute: ActivatedRoute, private modalService: NgbModal, private contactUsService: ContactUsService, private toastr: ToastrService) { }
  contactUsdetailsId: any;
  loading: boolean = false;
  contactUsDetails: ContactUsDetails;

  ngOnInit(): void {

    this.contactUsdetailsId = this.activateroute.snapshot.paramMap.get('id') || '';
    this.getDetails()
  }

  getDetails() {
    this.loading = true;
    this.contactUsService.getContactUsDetails(this.contactUsdetailsId).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.contactUsDetails = resp.data;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    })
  }


  goback() {
    this.location.back()
  }

  openEmailPopup() {
    const modalRef = this.modalService.open(SendEmailComponent, {
      windowClass: 'conatct-send-mail',
    })
    modalRef.componentInstance.contactUsDetailsId = this.contactUsDetails.id
    modalRef.componentInstance.subject = this.contactUsDetails.subject

    modalRef.result.then().catch((resp: any) => {
      if (resp == 'sent') {
        const modalRef2 = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-vehicle-modal ',
        });
        modalRef2.componentInstance.emailSuccessBtnText = 'Email Sent Successfully!!'
        modalRef2.result.then().catch((resp1: any) => {
          if (resp1 == 'ok') {
            this.getDetails()
          }
        })

      } else if (resp == 'Cross click') {
        return;
      }
    })


  }
}
