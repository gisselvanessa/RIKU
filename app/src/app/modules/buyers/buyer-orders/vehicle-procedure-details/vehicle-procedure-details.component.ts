import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-buyer-vehicle-procedure-details',
  templateUrl: './vehicle-procedure-details.component.html',
  styleUrls: ['./vehicle-procedure-details.component.scss']
})
export class BuyerVehicleProcedureDetailsComponent implements OnInit {

  vehicleProcedureId: string;
  constructor(private location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.vehicleProcedureId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  back(){
    this.location.back();
  }

}
