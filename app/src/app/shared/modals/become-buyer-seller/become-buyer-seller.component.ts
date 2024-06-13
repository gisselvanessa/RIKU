import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { SuccessfullComponent } from '../successfull/successfull.component';

@Component({
  selector: 'app-become-buyer-seller',
  templateUrl: './become-buyer-seller.component.html',
  styleUrls: ['./become-buyer-seller.component.scss']
})
export class BecomeBuyerSellerComponent implements OnInit {

  isLoading: boolean = false;
  @Input() becomeType: string;

  constructor(
    private modalService: NgbModal, 
    public activeModal: NgbActiveModal,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  becomeAsSeller(){
    this.isLoading = true;  
    this.userService.postBuyerAsSeller().subscribe((resp: any) => {
      this.isLoading = false; 
      if (resp.success_code === 'ROLE_ADDED') {        
        let typeArray = JSON.parse(localStorage.getItem('type')!)
        typeArray.push('seller')
        localStorage.setItem('type', JSON.stringify(typeArray))
        this.activeModal.dismiss(true);
        this.OpenSuccessModal();
      }
    })  
  }

  becomeBuyer(){
    this.isLoading = true;  
    this.userService.postSellerAsBuyer().subscribe((resp: any) => {
      this.isLoading = false; 
      if (resp.success_code === 'ROLE_ADDED') {
        let typeArray = JSON.parse(localStorage.getItem('type')!)
        typeArray.push('buyer')
        localStorage.setItem('type', JSON.stringify(typeArray)) 
        this.activeModal.dismiss(true);
        this.OpenSuccessModal();
      }
    })  
  }

  //this funtion is used to open delete medel
  OpenSuccessModal() {    
    const modalRef = this.modalService.open(SuccessfullComponent, {
      windowClass: 'delete-vehicle-modal ',
    });
    modalRef.componentInstance.becomeType = this.becomeType;
    modalRef.componentInstance.becomeTypeStatus = true;    
  }
}
