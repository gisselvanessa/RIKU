import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArrayHelper } from 'src/app/shared/helpers/array-helper';
import { BuyerVehicleService } from '../buyer-vehicle.service';
import { TermsConditionsChatCallComponent } from '../buyer-vehicle/terms-conditions-chat-call/terms-conditions-chat-call.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-buyer-favourites',
  templateUrl: './buyer-favourites.component.html',
  styleUrls: ['./buyer-favourites.component.scss']
})

export class BuyerFavouritesComponent implements OnInit {

  constructor(private buyerService: BuyerVehicleService, private modalService: NgbModal,
    private toastr: ToastrService, private router: Router, private translate: TranslateService) { }

  vehicleDataArray: any = [];
  vehicleListData: any;
  loading: any = true;
  selectedTab = 'vehicles';

  ngOnInit(): void {
    this.getAllVehicleList()
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }

  unfavouriteVehicle(firstIndex: number, secondIndex: number) {
    this.buyerService.deletFavouriteVehicle(this.vehicleDataArray[firstIndex][secondIndex].id).subscribe((resp: any) => {
      if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
        this.getAllVehicleList()
        this.toastr.success(this.translate.instant('Vehicle has been removed from favorite list'))
      }
    })
  }



  getAllVehicleList(): void {
    this.loading = true;
    this.buyerService.getFavouriteVehicle().subscribe((res: any) => {
      this.vehicleListData = res.data;
      this.vehicleDataArray = ArrayHelper.getArrayChunks(this.vehicleListData, 3)
      this.loading = false;
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }







  openContact(typeOfContact: string, userType: string, userId: string) {
    this.buyerService.getTermsAndConditionData(typeOfContact.toLowerCase(), userId).subscribe((resp: any) => {
      const isAccepted = resp.data.is_accepted
      if (isAccepted === false) {
        const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
          windowClass: 'delete-vehicle-modal modal-lg'
        })

        modalRef.componentInstance.typeOfContact = typeOfContact;
        modalRef.componentInstance.userType = userType;
        modalRef.componentInstance.userId = userId
        modalRef.result.catch((result: any) => {
          if (result === 'proceed') {
            if (typeOfContact === 'Chat') {
              this.router.navigate(['/buyer/chat-user']);
            } else if (typeOfContact === 'Call') {
              this.router.navigate(['/buyer/call-user']);
            }
          }
        })
      } else {
        return
      }

    })

  }

}
