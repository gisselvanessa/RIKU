import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dealer-vehicle-procedure-details',
  templateUrl: './dealer-vehicle-procedure-details.component.html',
  styleUrls: ['./dealer-vehicle-procedure-details.component.scss']
})
export class DealerVehicleProcedureDetailsComponent implements OnInit {

  vehicleProcedureId: string;
  constructor(private location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.vehicleProcedureId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  back(){
    this.location.back();
  }
}
