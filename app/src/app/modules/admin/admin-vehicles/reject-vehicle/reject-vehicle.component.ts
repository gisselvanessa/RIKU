import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteConfirmationComponent} from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { AdminVehicleService } from '../admin-vehicles.service';


@Component({
  selector: 'app-reject-vehicle',
  templateUrl: './reject-vehicle.component.html',
  styleUrls: ['./reject-vehicle.component.scss']
})

export class RejectVehicleComponent implements OnInit {
  user: any;
  vehicleListData: any;
  loading: any = true;
  page: any = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  deletedVehicleId: string;
  role: any = JSON.parse(localStorage.getItem('type') || '')
  typeIsSeller: any;
  vehicleMakeYears = [];
  vehicleModels: any;
  vehicleModelsClone: any;
  popularMakes: any;
  nonPopularMakes: any;
  makeId: any;
  vehicleTypes: any;
  vehicleMakes: any;
  province: any;
  selectedMake: any;
  selectedType: any;
  selectedModel: any;
  selectedProvince: any;
  selectedStatus: any;
  selectedMakeId: any;
  selectedTypeId: any;
  selectedModelId: any;
  searchText: any;
  order: any = 'ASC';
  user_province: any ;
  searchApplied:boolean = false;
  statusList = [{id: 'approved', status: 'Approved'},
    {id: 'rejected', status: 'Rejected'},
    {id: 'pending', status: 'Awaiting Approval'},
    {id: 'draft', status: 'Draft'}]


  constructor(private adminVehicleService: AdminVehicleService, public router: Router, private toastr: ToastrService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  rejectVehicle(){
    this.adminVehicleService.approveDisaproveVehicle({
      vehicleId: 'test',
      is_approved: false
    }).subscribe((res) => {

    }, (error) => {

    })
  }
}
