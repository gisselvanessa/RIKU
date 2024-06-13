import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerVehicleService } from '../../buyer-vehicle.service';
import { VehicleDetailsService } from '../buyer-vehicle-details/vehicle-details.service';

@Component({
  selector: 'app-vehicle-policies',
  templateUrl: './vehicle-policies.component.html',
  styleUrls: ['./vehicle-policies.component.scss']
})
export class VehiclePoliciesComponent implements OnInit {

  constructor(private activateroute: ActivatedRoute, private location: Location, private router: Router, private buyerService: BuyerVehicleService, private vehicleService: VehicleDetailsService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false }
  }
  policyName: string = ''
  vehicleId: string;
  policyData:any;

  ngOnInit(): void {
    this.policyName = this.activateroute.snapshot.paramMap.get('policyName') || '';
    this.vehicleService.vehicleId$.subscribe((id: any) => {
      this.vehicleId = id
    })
    this.setPolicyName(this.policyName)


  }


  setPolicyName(policyName: any) {
    this.buyerService.getTermsandConditions(policyName).subscribe((resp:any)=>{
        this.policyData = resp.data.html
    })
  }

  back() {
    this.location.back()
  }

}
