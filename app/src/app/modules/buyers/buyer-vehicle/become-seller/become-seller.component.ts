import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleDetailsService } from '../buyer-vehicle-details/vehicle-details.service';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BecomeSellerComponent implements OnInit {

  constructor(private fb: FormBuilder, private vehicleService: VehicleDetailsService, private modalService: NgbModal, public activeModal: NgbActiveModal, private router: Router) { }

  vehicleForm: FormGroup;
  vehicleTyp = ['cars', 'commercial_vehicles']
  @ViewChild('success') openSuccessModal: TemplateRef<any>;
  successModal: any;
  vehicleId: string = ''
  ngOnInit() {
    this.createForm()
    this.vehicleService.vehicleId$.subscribe((id: any) => {
      this.vehicleId = id
    })
  }

  createForm() {
    this.vehicleForm = this.fb.group({
      vehicle_types: this.fb.array([], [Validators.required])
    })
  }

  onCheckValue(event: any) {
    const formArray: FormArray = this.vehicleForm.get('vehicle_types') as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    }
    else {
      let i: number = 0;
      formArray.controls.forEach((resp: AbstractControl) => {
        if (resp.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      })
    }
  }

  onSubmit() {
    this.vehicleService.postBuyerAsSeller(this.vehicleForm.value.vehicle_types).subscribe((resp: any) => {
      if (resp.success_code === 'ROLE_ADDED') {
        this.successModal = this.modalService.open(this.openSuccessModal, { size: 'lg', backdrop: 'static', centered: true })
        this.successModal.result.catch((res: any) => {
          if (res === 'ok') {
            let typeArray = JSON.parse(localStorage.getItem('type')!)
            typeArray.push('seller')
            localStorage.setItem('type', JSON.stringify(typeArray))
            setTimeout(() => {
              this.router.navigate([`buyer/vehicles/buyer-vehicle-list`])
            }, 1000);

          }
        })

      }
    })
  }
  redirect() {
    this.router.navigate([`buyer/vehicles/buyer-vehicle-list`])
  }

}
