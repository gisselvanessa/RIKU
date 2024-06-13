import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seller-vehicle-procedure-details',
  templateUrl: './seller-vehicle-procedure-details.component.html',
  styleUrls: ['./seller-vehicle-procedure-details.component.scss']
})
export class SellerVehicleProcedureDetailsComponent implements OnInit {
  vehicleProcedureId: string;
  constructor(private location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.vehicleProcedureId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  back(){
    this.location.back();
  }

}
