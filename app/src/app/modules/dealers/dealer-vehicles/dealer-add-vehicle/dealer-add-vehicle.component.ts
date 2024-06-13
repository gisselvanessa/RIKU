import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { DealerVehiclesService } from '../dealer-vehicles.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dealer-add-vehicle',
  templateUrl: './dealer-add-vehicle.component.html',
  styleUrls: ['./dealer-add-vehicle.component.scss'],
})

export class DealerAddVehicleComponent implements OnInit {
  makeId: any;
  typeId: any;
  modelId: any;
  vehicleTypes: any[] = [];
  selectedDuration: any;
  sendDuration: any;
  selectDuration: any[] = [
    { value: '1', option: '1 month' },
    { value: '2', option: '2 month' },
    { value: '3', option: '3 month' },
    { value: '4', option: '4 month' },
    { value: '5', option: '5 month' },
  ];
  vehicleMakes: any[] = [];
  popularMakes: any[] = [];
  nonPopularMakes: any[] = [];
  vehicleMakeYears: any[] = [];
  vehicleModels: any[] = [];
  vehicleCondition: any[] = ['used', 'new'];

  selectedVehicleType: string;
  selectedVehicleCondition: string;
  selectedVehicleMake: string;
  selectedVehicleMakeYear: string;
  selectedVehicleModel: string;
  searchYear: string = '';
  searchModel: string = '';
  searchMake: string = '';
  receivedReceipt: boolean = false;

  @Input() vehicleId?: any;
  @Input() vehicleDetail?: any;

  constructor(
    private addVehicleService: AddVehicleService,
    private dealerVehiclesService: DealerVehiclesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getVehicleTypes();
    this.vehicleId =
      this.activatedRoute.snapshot.paramMap.get('id') || undefined;
    if (this.vehicleId && this.vehicleDetail) {
      this.vehicleDetail.vehicle_make = this.vehicleDetail.make;
      this.vehicleDetail.vehicle_type = this.vehicleDetail.vehicle_type;
      this.vehicleDetail.vehicle_model = this.vehicleDetail.make_model;
      this.vehicleDetail.make_year = this.vehicleDetail.model_year;
      this.vehicleDetail.duration = this.vehicleDetail.duration;
      this.preFillDetails(this.vehicleDetail);
      this.addVehicleService.changeVehicle({
        make_id: this.vehicleDetail.make_id,
        vehicle_type: this.selectedVehicleType,
        condition: this.selectedVehicleCondition,
        type_id: this.vehicleDetail.type_id,
        vehicle_make: this.selectedVehicleMake,
        make_year: this.selectedVehicleMakeYear,
        model_id: this.vehicleDetail.model_id,
        vehicle_model: this.selectedVehicleModel,
        duration: this.vehicleDetail.duration,
      });
    } else {
      let vehicleDetail: any = localStorage.getItem('vehicleObj');
      if (vehicleDetail) {
        vehicleDetail = JSON.parse(vehicleDetail);
        this.preFillDetails(vehicleDetail);
        localStorage.removeItem('vehicleObj');
      }
    }
  }
  async preFillDetails(vehicleDetail: any) {
    this.makeId = vehicleDetail.make_id;
    this.typeId = vehicleDetail.type_id;
    this.modelId = vehicleDetail.model_id;
    await this.getVehicleMake(vehicleDetail.type_id);
    await this.getVehicleMakeYear(vehicleDetail.make_id);
    await this.getVehicleModel(vehicleDetail.make_year);
    this.selectedVehicleType = vehicleDetail.vehicle_type;
    this.selectedVehicleCondition = vehicleDetail.condition;
    this.selectedVehicleMake = vehicleDetail.vehicle_make;
    this.selectedVehicleMakeYear = vehicleDetail.make_year;
    this.selectedVehicleModel = vehicleDetail.vehicle_model;
    const index = this.selectDuration.findIndex(
      (x: any) => x.value == vehicleDetail.duration
    );
    if (index > 0) {
      this.selectedDuration = this.selectDuration[index].option;
      this.sendDuration = this.selectDuration[index].value;
    }

  }

  ngOnChanges() {
    this.ngOnInit();
  }

  public getVehicleTypes() {
    this.addVehicleService.getVehicleTypes().subscribe(
      (res: any) => {
        this.vehicleTypes = res.data;
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public getVehicleMake(type_id: any) {
    this.vehicleMakeYears = [];
    this.vehicleModels = [];
    this.selectedVehicleMake = '';
    this.selectedVehicleMakeYear = '';
    this.selectedVehicleModel = '';
    let url_param;
    if (type_id) {
      url_param = { vehicleTypeId: type_id };
    }
    this.addVehicleService.getMake(url_param).subscribe(
      (res: any) => {
        this.vehicleMakes = res.data;
        this.popularMakes = ArrayHelper.getArrayChunks(
          res.data.filter((x: any) => x.is_popular),
          4
        );
        this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
        this.addVehicleService.changeVehicle({
          make_id: this.vehicleDetail ? this.vehicleDetail.make_id : '',
          vehicle_type: this.selectedVehicleType,
          condition: this.selectedVehicleCondition,
          type_id: type_id ? type_id : this.vehicleDetail.type_id,
          vehicle_make: this.selectedVehicleMake,
          make_year: this.selectedVehicleMakeYear,
          model_id: this.vehicleDetail ? this.vehicleDetail.model_id : '',
          vehicle_model: this.selectedVehicleModel,
          duration: this.sendDuration,
        });
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public getVehicleMakeYear(make_id: any) {
    this.vehicleModels = [];
    this.selectedVehicleMakeYear = '';
    this.selectedVehicleModel = '';
    this.addVehicleService.getMakeYears(make_id).subscribe(
      (res: any) => {
        this.makeId = make_id;
        this.vehicleMakeYears = res.data.years;
        this.addVehicleService.changeVehicle({
          make_id: make_id
            ? make_id
            : this.vehicleDetail
              ? this.vehicleDetail.make_id
              : '',
          vehicle_type: this.selectedVehicleType,
          condition: this.selectedVehicleCondition,
          type_id: this.typeId,
          vehicle_make: this.selectedVehicleMake,
          make_year: this.selectedVehicleMakeYear
            ? this.selectedVehicleMakeYear
            : 0,
          model_id: this.vehicleDetail ? this.vehicleDetail.model_id : '',
          vehicle_model: this.selectedVehicleModel,
          duration: this.sendDuration,
        });
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public getVehicleModel(year: any) {
    this.selectedVehicleModel = '';
    this.addVehicleService.getModels(this.makeId, year).subscribe(
      (res: any) => {
        this.vehicleModels = res.data;
        this.addVehicleService.changeVehicle({
          make_id: this.vehicleDetail?.make_id,
          vehicle_type: this.selectedVehicleType,
          condition: this.selectedVehicleCondition,
          type_id: this.typeId,
          vehicle_make: this.selectedVehicleMake,
          make_year: year,
          model_id: this.vehicleDetail ? this.vehicleDetail.model_id : '',
          vehicle_model: this.selectedVehicleModel,
          duration: this.sendDuration,
        });
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public setVehicleModel(modelId: string) {
    this.modelId = modelId;
    this.addVehicleService.changeVehicle({
      make_id: this.vehicleDetail?.make_id,
      vehicle_type: this.selectedVehicleType,
      condition: this.selectedVehicleCondition,
      type_id: this.typeId,
      vehicle_make: this.selectedVehicleMake,
      make_year: this.selectedVehicleMakeYear,
      model_id:
        modelId != ''
          ? modelId
          : this.vehicleDetail
            ? this.vehicleDetail.model_id
            : '',
      vehicle_model: this.selectedVehicleModel,
      duration: this.sendDuration,
    });
  }

  public setDuration(duration: any) {
    this.selectedDuration = duration.option;
    this.sendDuration = duration.value;
    this.addVehicleService.changeVehicle({
      make_id: this.vehicleDetail?.make_id,
      vehicle_type: this.selectedVehicleType,
      condition: this.selectedVehicleCondition,
      type_id: this.typeId,
      vehicle_make: this.selectedVehicleMake,
      make_year: this.selectedVehicleMakeYear,
      model_id: this.modelId != '' ? this.modelId : this.vehicleDetail ? this.vehicleDetail.model_id : '',
      vehicle_model: this.selectedVehicleModel,
      duration: this.sendDuration,
    });
  }

  public submitAddForm() {
    if (!this.selectedVehicleCondition || this.selectedVehicleCondition == '') {
      this.toastr.error(this.translate.instant('Please select Condition.'));
    } else if (
      this.selectedVehicleType == undefined ||
      this.selectedVehicleType == ''
    ) {
      this.toastr.error(this.translate.instant('Please select Type.'));
    } else if (!this.selectedVehicleMake || this.selectedVehicleMake == '') {
      this.toastr.error(this.translate.instant('Please select Make.'));
    } else if (
      !this.selectedVehicleMakeYear ||
      this.selectedVehicleMakeYear == ''
    ) {
      this.toastr.error(this.translate.instant('Please select Year.'));
    } else if (!this.selectedVehicleModel || this.selectedVehicleModel == '') {
      this.toastr.error(this.translate.instant('Please select Model.'));
    /* } else if (!this.selectedDuration || this.selectedDuration == '') {
      this.toastr.error(
        this.translate.instant('Please select Duration of Months you want to keep posted')
      ); */
    } else {
      let vehicleObj = {
        make_id: this.makeId,
        vehicle_type: this.selectedVehicleType,
        condition: this.selectedVehicleCondition,
        type_id: this.typeId,
        vehicle_make: this.selectedVehicleMake,
        make_year: this.selectedVehicleMakeYear,
        model_id: this.modelId,
        vehicle_model: this.selectedVehicleModel,
        /* duration: this.sendDuration, */
      };
      this.addVehicleService.changeVehicle(vehicleObj);
      localStorage.setItem('vehicleObj', JSON.stringify(vehicleObj));
      this.router.navigate(['/dealer/vehicles/add-vehicle-details']);
    }
  }

  onEditVehicle() {
    let vehicleObj = {
      make_id: this.makeId,
      vehicle_type: this.selectedVehicleType,
      condition: this.selectedVehicleCondition,
      type_id: this.typeId,
      vehicle_make: this.selectedVehicleMake,
      make_year: this.selectedVehicleMakeYear,
      model_id: this.modelId,
      vehicle_model: this.selectedVehicleModel,
      duration: this.sendDuration,
    };
    this.addVehicleService.changeVehicle(vehicleObj);
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(
          this.vehicleMakes.filter(
            (x: any) =>
              x.is_popular &&
              x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >
              -1
          ),
          4
        );
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) =>
            !x.is_popular &&
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(
          this.vehicleMakes.filter((x: any) => x.is_popular),
          4
        );
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) => !x.is_popular
        );
      }
    } else if (filterKey == 'year') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(
          this.vehicleMakes.filter(
            (x: any) =>
              x.is_popular &&
              x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >
              -1
          ),
          4
        );
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) =>
            !x.is_popular &&
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(
          this.vehicleMakes.filter((x: any) => x.is_popular),
          4
        );
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) => !x.is_popular
        );
      }
    }
  }

  receiveReceipt(data: any) {
    this.receivedReceipt = data;
  }
}
