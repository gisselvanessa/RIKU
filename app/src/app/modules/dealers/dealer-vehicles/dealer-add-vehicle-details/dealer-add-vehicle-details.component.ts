import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AddVehicleConstants } from 'src/app/shared/constant/add-vehicle-constants';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { SpaceValidator } from 'src/app/shared/validators';
import { DealerVehiclesService } from '../dealer-vehicles.service';
import { DateHelper } from 'src/app/shared/helpers/date-helper';
import { TranslateService } from '@ngx-translate/core';
import { ArrayHelper } from 'src/app/shared/helpers/array-helper';
import { Plan } from 'src/app/interfaces/plan.interface';

@Component({
  selector: 'app-dealer-add-vehicle-details',
  templateUrl: './dealer-add-vehicle-details.component.html',
  styleUrls: ['./dealer-add-vehicle-details.component.scss'],
})

export class DealerAddVehicleDetailsComponent implements OnInit, AfterViewInit {
  specificationsForm: FormGroup;
  submitting: boolean;
  errStatus: any;
  errMessage: any;
  err: any;
  loading: boolean = false;
  step = 1;
  bodyTypeList: Array<any> = [];
  provinceList: Array<string> = [];
  basicVehicleDetails: any;
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList: Array<string> = [];
  outsideColor: any = AddVehicleConstants.outsideColor;
  fuelTypeList: Array<string> = AddVehicleConstants.fuelTypeList;
  glassTypeList: Array<string> = AddVehicleConstants.glassTypeList;
  comfortList: Array<string> = AddVehicleConstants.comfortList;
  technologyList: Array<string> = AddVehicleConstants.technologyList;
  entertainmentList: Array<string> = AddVehicleConstants.entertainmentList;
  // utilityList: Array<string> = AddVehicleConstants.utilityList;
  securityList: Array<string> = AddVehicleConstants.securityList;
  tonCapacityList: Array<string> = AddVehicleConstants.tonCapacityList;
  comforts: any = [];
  technologies: any = [];
  entertainments: any = [];
  utilities: any = [];
  mileageList: Array<string> = AddVehicleConstants.mileageList;
  transmissionList: Array<string> = AddVehicleConstants.transmissionList;
  vehicleBodyType: string;
  securities: any = [];
  cityList = [];
  vehicleCondition: string;
  vehicleId: string | undefined;
  vehicleDetail: any;
  isImageUploading: boolean = false;
  isAdditionalImagesUploading: boolean = false;
  getNextYear: number;
  dataSubmitting: boolean;
  vehicleDescription: string;
  plans: Plan[] = [
    // {
    //   name: 'Gratis',
    //   bgColor: '#EC8F67',
    //   characteristics: [
    //     {
    //       id: 1,
    //       name: '1 Mes de Publicación para tu vehículo'
    //     }
    //   ]
    // },
    {
      name: 'Estándar',
      price: '99,99',
      bgColor: '#9E438F',
      characteristics: [
        {
          id: 1,
          name: '1 Mes de Publicación para tu vehículo'
        }
      ]
    },
    {
      name: 'Recomendado',
      price: '399,99',
      bgColor: '#3C759A',
      characteristics: [
        {
          id: 2,
          name: '90 Días de Publicación para tu vehículo'
        }
      ]
    },
    {
      name: 'Plus',
      price: '699,99',
      bgColor: '#4E1F4F',
      characteristics: [
        {
          id: 3,
          name: '5 meses de Publicación para tu vehículo'
        }
      ]
    },
  ];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private addVehicleService: AddVehicleService,
    private dealerVehiclesService: DealerVehiclesService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  basicDetailsForm: FormGroup;
  basicDetailControls: any;
  specificationsControls: any;
  basic_detail_step = false;
  is_negotiable: string;
  distance_travelled_unit = 'Kilometers';
  passangerCapacity: any = [];
  specificationsValue: any;
  primaryPhotoUrl: any;
  otherPhotoUrls: Array<any> = [];
  primaryPhotoName: string | null;
  vehicleImagesAndDocuments: any = {
    other_img_asset_urls: [],
    cover_img_asset_url: null,
    doc_type: null,
    doc_number: null,
  };

  ngOnInit() {
    this.vehicleId = this.activateRoute.snapshot.paramMap.get('id') || undefined;
    this.createForms();
    this.getMasterData();
    this.getNextYear = DateHelper.getNextYear()
    this.addVehicleService.vehicleMakeDetail.subscribe((res: any) => {
      if (res) {
        this.basicVehicleDetails = res;
        this.vehicleCondition = res.condition
        this.newUsedVehicleFormChanges();
      }
    });
    this.newUsedVehicleFormChanges();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.vehicleId) {
        this.getVehicle(this.vehicleId);
      } else {
        this.basicVehicleDetails = JSON.parse(
          localStorage.getItem('vehicleObj') || ''
        );
        this.vehicleCondition = this.basicVehicleDetails.condition;
      }
    }, 1000);
  }

  public getVehicle(vehicle_id: string) {
    if (vehicle_id) {
      this.dealerVehiclesService.getVehicle(vehicle_id).subscribe(
        (res: any) => {
          this.vehicleCondition = res.data.condition;
          this.vehicleDetail = res.data;
          this.newUsedVehicleFormChanges();
          this.setFormControlValues();

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
  }

  getMasterData() {
    forkJoin(
      this.addVehicleService.getBodyType(),
      this.addVehicleService.getProvinceList()
    ).subscribe((data: Array<any>) => {
      this.bodyTypeList = ArrayHelper.getArrayChunks(data[0].data, 4);
      this.provinceList = data[1].data;
    });
  }

  createForms() {
    try {
      const date = new Date();
      const currentYear: any = date.getFullYear();
      this.basicDetailsForm = this.fb.group({
         licence_number: [
          '',
          {
            validators: [
            //  Validators.required,
            //  Validators.minLength(17),
           //   Validators.maxLength(17),
           //   SpaceValidator.cannotContainSpace,
            ],
          },
        ],
        number_plate: [],
        registration_year: [],
        distance_travelled: [
          '',
          [Validators.required],
        ],
        distance_travelled_unit: [this.distance_travelled_unit, Validators.required],
        is_negotiable: ['', Validators.required],
        price: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        province: ['', [Validators.required]],
        city: ['', [Validators.required]],
        // description: ['', [Validators.required, Validators.maxLength(1000)]],
        parish: ['', [Validators.required]],
      });
      this.specificationsForm = this.fb.group({
        body_type_id: ['', Validators.required],
        // mileage: [
        //   '',
        //   { validators: [Validators.required, Validators.max(100.0)] },
        // ],
        // mileage_unit: ['Kilometers', Validators.required],
        passanger_capacity: ['', Validators.required],
        transmission: ['', Validators.required],
        passanger_doors: ['', Validators.required],
        break_type: ['', Validators.required],
        color: ['', Validators.required],
        fuel_type: ['', Validators.required],
        glass_type: ['', Validators.required],
        // body_work: ['', Validators.required],
        engine_size: [
          '',
          { validators: [Validators.required] },
        ],
        tonage_capacity: [''],
        comforts: [''],
        technologies: [''],
        entertainments: [''],
        utilities: ['',],
        securities: [''],
      });
      this.basicDetailControls = this.basicDetailsForm.controls;
      this.specificationsControls = this.specificationsForm.controls;
      this.specificationsValue = this.specificationsForm.value;
      for (let i = 1; i <= 60; i++) {
        this.passangerCapacity.push(i);
      }
    } catch (error) {
      //console.log(error);
    }
  }

  preventBackSpace(e: any) {
    if (e.target.value.length == 1) {
      e.preventBackSpace()
    }
  }

  setFormControlValues() {
    this.basicDetailsForm.controls['licence_number'].setValue(
      this.vehicleDetail.licence_number
    );
    this.basicDetailsForm.controls['number_plate'].setValue(
      this.vehicleDetail.number_plate
    );
    this.basicDetailsForm.controls['registration_year'].setValue(
      this.vehicleDetail.registration_year
    );
    this.basicDetailsForm.controls['distance_travelled'].setValue(
      this.vehicleDetail.distance_travelled
    );
    this.distance_travelled_unit = (!this.vehicleDetail.distance_travelled_unit || this.vehicleDetail.distance_travelled_unit == '') ? 'Kilometers' : this.vehicleDetail.distance_travelled_unit;
    this.basicDetailsForm.controls['distance_travelled_unit'].setValue(
      this.distance_travelled_unit
    );
    this.basicDetailsForm.controls['is_negotiable'].setValue(
      this.vehicleDetail.is_negotiable
    );
    this.is_negotiable = this.vehicleDetail.is_negotiable ? 'Yes' : 'No';
    this.basicDetailsForm.controls['price'].setValue(
      parseFloat(this.vehicleDetail.price ? this.vehicleDetail.price : 0).toLocaleString('es'));
    this.basicDetailsForm.controls['province'].setValue(
      this.vehicleDetail.location.province
    );
    this.setProvice(this.vehicleDetail.location.province);
    this.basicDetailsForm.controls['city'].setValue(
      this.vehicleDetail.location.city
    );
    this.setCity(this.vehicleDetail.location.city);
    this.basicDetailsForm.controls['parish'].setValue(
      this.vehicleDetail.location.parish
    );
    this.setParish(this.vehicleDetail.location.parish);
    // this.basicDetailsForm.controls['description'].setValue(
    //   this.vehicleDetail.description
    // );
    this.vehicleDescription = this.vehicleDetail.description;
    this.specificationsForm.controls['body_type_id'].setValue(
      this.vehicleDetail.body_type_id
    );
    // this.specificationsForm.controls['mileage'].setValue(
    //   (this.vehicleDetail.mileage ? this.vehicleDetail.mileage : 0).toLocaleString('es')
    // );
    // this.specificationsForm.controls['mileage_unit'].setValue(this.vehicleDetail.mileage_unit ? this.vehicleDetail.mileage_unit : 'Kilometers');
    this.specificationsForm.controls['passanger_capacity'].setValue(
      this.vehicleDetail.passanger_capacity
    );
    this.specificationsForm.controls['passanger_doors'].setValue(
      this.vehicleDetail.passanger_doors
    );
    this.specificationsForm.controls['transmission'].setValue(
      this.vehicleDetail.transmission
    );
    this.specificationsForm.controls['break_type'].setValue(
      this.vehicleDetail.break_type
    );
    this.specificationsForm.controls['color'].setValue(
      this.vehicleDetail.color
    );
    this.specificationsForm.controls['fuel_type'].setValue(
      this.vehicleDetail.fuel_type
    );
    this.specificationsForm.controls['glass_type'].setValue(
      this.vehicleDetail.glass_type
    );
    // this.specificationsForm.controls['body_work'].setValue(
    //   this.vehicleDetail.body_work
    // );
    this.specificationsForm.controls['engine_size'].setValue(
      parseFloat(this.vehicleDetail.engine_size ? this.vehicleDetail.engine_size : 0).toLocaleString('es')
    );
    this.specificationsForm.controls['tonage_capacity'].setValue(
      this.vehicleDetail.tonage_capacity
    );

    this.comforts = [];
    this.technologies = [];
    this.utilities = [];
    this.securities = [];
    this.entertainments = [];

    if (this.vehicleDetail.comforts?.length > 0) {
      this.specificationsForm.controls['comforts'].setValue(
        this.vehicleDetail.comforts[0]
      );
      this.comforts = this.vehicleDetail.comforts;
    }
    if (this.vehicleDetail.technologies?.length > 0) {
      this.specificationsForm.controls['technologies'].setValue(
        this.vehicleDetail.technologies[0]
      );
      this.technologies = this.vehicleDetail.technologies;
    }
    if (this.vehicleDetail.utilities?.length > 0) {
      this.specificationsForm.controls['utilities'].setValue(
        this.vehicleDetail.utilities[0]
      );
      this.utilities = this.vehicleDetail.utilities;
    }
    if (this.vehicleDetail.securities?.length > 0) {
      this.specificationsForm.controls['securities'].setValue(
        this.vehicleDetail.securities[0]
      );
      this.securities = this.vehicleDetail.securities;
    }
    if (this.vehicleDetail.entertainments?.length > 0) {
      this.specificationsForm.controls['entertainments'].setValue(
        this.vehicleDetail.entertainments[0]
      );
      this.entertainments = this.vehicleDetail.entertainments;
    }
    this.vehicleBodyType = this.vehicleDetail.body_type;
    this.primaryPhotoUrl = this.vehicleDetail.cover_img_url.url
      ? this.vehicleDetail.cover_img_url.url
      : '';
    this.vehicleImagesAndDocuments.cover_img_asset_url = this.vehicleDetail
      .cover_img_url.key
      ? this.vehicleDetail.cover_img_url.key
      : '';
    for (
      let index = 0;
      index < this.vehicleDetail.other_img_urls.length;
      index++
    ) {
      this.otherPhotoUrls.push({
        src: this.vehicleDetail.other_img_urls[index].url,
      });
      this.vehicleImagesAndDocuments.other_img_asset_urls.push(
        this.vehicleDetail.other_img_urls[index].key
      );
    }
    this.vehicleImagesAndDocuments.doc_type = this.vehicleDetail.doc_type
      ? this.vehicleDetail.doc_type
      : 'cedula_id';
    this.vehicleImagesAndDocuments.doc_number = this.vehicleDetail.doc_number
      ? this.vehicleDetail.doc_number
      : null;
    this.basicDetailControls = this.basicDetailsForm.controls;
    this.specificationsControls = this.specificationsForm.controls;
    this.specificationsValue = this.specificationsForm.value;
  }

  createSpecificationForm() {
    this.specificationsForm = this.fb.group({
      body_type_id: ['', Validators.required],
      // mileage: ['', { validators: [Validators.required, Validators.max(100)] }],
      // mileage_unit: ['Kilometer', Validators.required],
      passanger_capacity: ['', Validators.required],
      transmission: ['', Validators.required],
      passanger_doors: ['', Validators.required],
      break_type: ['', Validators.required],
      color: ['', Validators.required],
      fuel_type: ['', Validators.required],
      glass_type: ['', Validators.required],
      // body_work: ['', Validators.required],
      engine_size: [
        '',
        { validators: [Validators.required] },
      ],
      tonage_capacity: [''],
      comforts: [''],
      technologies: [''],
      entertainments: [''],
      utilities: [''],
      securities: [''],
    });
  }

  getBodyType() {
    this.addVehicleService.getBodyType().subscribe(
      (res: any) => {
        this.bodyTypeList = res.data;
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

  next() {
    if (this.step == 1) {
      this.basic_detail_step = true;
      this.submitting = true;
      if (this.basicDetailsForm.invalid) {
        return;
      }
      this.submitting = false;
      this.step++;
    } else if (this.step == 2) {
      this.submitting = true;
      if (
        this.specificationsForm.value.tonage_capacity == '' &&
        (this.basicVehicleDetails.vehicle_type == 'Heavy' ||
          this.basicVehicleDetails.vehicle_type == 'Work Machinery')
      ) {
        return;
      }
      if (this.specificationsForm.invalid) {
        return;
      }
      /*if (this.comforts.length == 0) {
        return;
      } else if (this.entertainments.length == 0) {
        return;
      } else if (this.technologies.length == 0) {
        return;
      } else if (this.utilities.length == 0) {
        return;
      } else if (this.securities.length == 0) {
        return;
      }*/
      this.submitting = false;
      this.step++;
    } else if (this.step == 3) {
      this.submitting = true;
      if (this.basicDetailsForm.invalid) {
        return;
      }
      this.submitting = false;
      this.step++;
    }
  }

  previous() {
    this.step--;
    if (this.step == 1) {
      //this.personal_step = false;
    }
  }

  changeToDecimal(e: any) {
    const mileageValue = e.target.value;
    const decimalPoint = ",";
    const position = 2;
    if (mileageValue.length > 2 && !mileageValue.includes(decimalPoint)) {
      const modifiedMileageValue = [mileageValue.slice(0, position), decimalPoint, mileageValue.slice(position)].join('');
      this.specificationsForm.controls['mileage'].setValue(modifiedMileageValue)
    } else {
      this.specificationsForm.controls['mileage'].setValue(mileageValue)
    }
  }
  setToDecimal(e: any) {
    const mileageValue = e;
    const decimalPoint = ",";
    const position = 2;
    if (mileageValue.toString().length > 2 && !mileageValue.toString().includes(decimalPoint)) {
      const modifiedMileageValue = [mileageValue.toString().slice(0, position), decimalPoint, mileageValue.toString().slice(position)].join('');
      return modifiedMileageValue
    } else {
      return mileageValue
    }
  }

  removeDuplicates(arr = []) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  checkNgbDropdown(formControlName: any, value: any) {
    if (formControlName == 'comforts') {
      this.comforts = this.removeDuplicates(this.comforts);
      if (this.comforts.indexOf(value) > -1) {
        this.comforts.splice(this.comforts.indexOf(value), 1);
      } else {
        this.comforts.push(value);
      }
      this.specificationsControls[formControlName].setValue(this.comforts);
    } else if (formControlName == 'technologies') {
      this.technologies = this.removeDuplicates(this.technologies);
      if (this.technologies.indexOf(value) > -1) {
        this.technologies.splice(this.technologies.indexOf(value), 1);
      } else {
        this.technologies.push(value);
      }
      this.specificationsControls[formControlName].setValue(this.technologies);
    } else if (formControlName == 'entertainments') {
      this.entertainments = this.removeDuplicates(this.entertainments);
      if (this.entertainments.indexOf(value) > -1) {
        this.entertainments.splice(this.entertainments.indexOf(value), 1);
      } else {
        this.entertainments.push(value);
      }
      this.specificationsControls[formControlName].setValue(
        this.entertainments
      );
    } else if (formControlName == 'utilities') {
      this.utilities = this.removeDuplicates(this.utilities);
      if (this.utilities.indexOf(value) > -1) {
        this.utilities.splice(this.utilities.indexOf(value), 1);
      } else {
        this.utilities.push(value);
      }
      this.specificationsControls[formControlName].setValue(this.utilities);
    } else if (formControlName == 'securities') {
      this.securities = this.removeDuplicates(this.securities);
      if (this.securities.indexOf(value) > -1) {
        this.securities.splice(this.securities.indexOf(value), 1);
      } else {
        this.securities.push(value);
      }
      this.specificationsControls[formControlName].setValue(this.securities);
    } else if (formControlName == 'body_type_id') {
      this.specificationsControls[formControlName].setValue(value.id);
      this.vehicleBodyType = value.type;
    } else {
      this.specificationsControls[formControlName].setValue(value);
    }
    this.specificationsValue = this.specificationsForm.value;
  }

  onSubmit(draft: boolean) {
    if (
      !this.basicVehicleDetails.vehicle_type ||
      this.basicVehicleDetails.vehicle_type == ''
    ) {
      this.toastr.error(this.translate.instant('Please Select Vehicle Type'));
      return;
    } else if (
      !this.basicVehicleDetails.vehicle_make ||
      this.basicVehicleDetails.vehicle_make == ''
    ) {
      this.toastr.error(this.translate.instant('Please Select Vehicle Make'));
      return;
    } else if (
      !this.basicVehicleDetails.make_year ||
      this.basicVehicleDetails.make_year == ''
    ) {
      this.toastr.error(this.translate.instant('Please Select Vehicle Year'));
      return;
    } else if (
      !this.basicVehicleDetails.vehicle_model ||
      this.basicVehicleDetails.vehicle_model == ''
    ) {
      this.toastr.error(this.translate.instant('Please Select Vehicle Model'));
      return;
    }

    if (!draft) {
      this.submitting = true;
      this.basicDetailsForm.get('distance_travelled_unit')?.setValue(this.distance_travelled_unit);
      if (this.basicDetailsForm.invalid) {
        this.toastr.error(this.translate.instant('Please fill Basic details properly'));
        return;
      } else if (
        (!this.specificationsForm.value.tonage_capacity || this.specificationsForm.value.tonage_capacity == '') &&
        (this.basicVehicleDetails.vehicle_type == 'Heavy' ||
          this.basicVehicleDetails.vehicle_type == 'Work Machinery')
      ) {
        return;
      }
      else if (this.specificationsForm.invalid) {
        this.toastr.error(this.translate.instant('Please fill Specifications details properly'));
        return;
      } else if (!this.vehicleDescription || this.vehicleDescription.trim() == '') {
        return;
      } else {
        if (
          this.vehicleImagesAndDocuments.cover_img_asset_url == null ||
          this.vehicleImagesAndDocuments.cover_img_asset_url == ''
        ) {
          this.toastr.error(this.translate.instant('Please upload Primary Photo'));
          return;
        } else if (
          this.vehicleImagesAndDocuments.other_img_asset_urls.length > 30
        ) {
          this.toastr.error(this.translate.instant('Maximum 30 images are allowed to upload'));
          return;
        }
        // else if (
        //   this.vehicleImagesAndDocuments.doc_number == null ||
        //   this.vehicleImagesAndDocuments.doc_number == ''
        // )
        // {
        //   this.toastr.error(this.translate.instant('Please enter Cedula ID or Passport Number'));
        //   return;
        // }
      }
    } else {
      if (!this.vehicleImagesAndDocuments.cover_img_asset_url) {
        delete this.vehicleImagesAndDocuments?.cover_img_asset_url;
      }
      if (this.vehicleImagesAndDocuments?.other_img_asset_urls?.length == 0) {
        delete this.vehicleImagesAndDocuments?.other_img_asset_urls;
      }
    }
    let vehicleFirstform: any;
    if (this.vehicleId) {
      vehicleFirstform = this.addVehicleService.vehicleBaseData;
    } else {
      vehicleFirstform = JSON.parse(localStorage.getItem('vehicleObj') || '');
    }
    let formData = {
      ...this.specificationsForm.value,
      ...this.basicDetailsForm.value,
      ...this.vehicleImagesAndDocuments,
      is_draft: draft,
      condition: vehicleFirstform.condition,
      vehicle_brand_id: vehicleFirstform.make_id,
      year: vehicleFirstform.make_year,
      /* duration: vehicleFirstform.duration, */
      model_id: vehicleFirstform.model_id,
      vehicle_type: vehicleFirstform.vehicleFirstform,
      type_id: vehicleFirstform.type_id,
      distance_travelled_unit: this.distance_travelled_unit,
      is_negotiable: this.is_negotiable == 'No' ? false : true,
      description: this.vehicleDescription
    };
    if (
      this.basicVehicleDetails.vehicle_type == 'Heavy' ||
      this.basicVehicleDetails.vehicle_type == 'Work Machinery'
    ) {
    } else {
      if (formData.tonage_capacity) {
        delete formData.tonage_capacity;
      }
    }
    if (formData.province && formData.city && formData.parish) {
      formData.location = {
        province: formData.province ? formData.province : '',
        city: formData.city ? formData.city : '',
        parish: formData.parish ? formData.parish : '',
      };
      delete formData.city;
      delete formData.province;
      delete formData.parish;
    }
    // formData.mileage = Number((this.specificationsForm.value.mileage).replace(",", ''))
    // if (this.specificationsForm.value.mileage.toString().includes(',')) {
    //   formData.mileage = ((this.specificationsForm.value.mileage).replace(",", ''))
    //   if (formData.mileage.includes('.')) {
    //     formData.mileage = ((formData.mileage).replace(".", ''))
    //   } else {
    //     formData.mileage = formData.mileage
    //   }
    // } else if (this.specificationsForm.value.mileage.toString().includes('.')) {
    //   formData.mileage = ((this.specificationsForm.value.mileage).replace(".", ''))
    //   if (formData.mileage.includes(',')) {
    //     formData.mileage = ((formData.mileage).replace(",", ''))
    //   } else {
    //     formData.mileage = formData.mileage
    //   }
    // } else {
    //   formData.mileage = this.specificationsForm.value.mileage
    // }
    // let mileage = this.specificationsForm.value.mileage.replaceAll('.', '');
    // formData.mileage = mileage.replaceAll(',', '.');

    // if (this.basicDetailsForm.value.price.toString().includes(',')) {
    //   formData.price = (this.basicDetailsForm.value.price).replace(",", '')
    //   if (formData.price.includes('.')) {
    //     formData.price = ((formData.price).replace(".", ''))
    //   } else {
    //     formData.price = formData.price
    //   }
    // } else if (this.basicDetailsForm.value.price.toString().includes('.')) {
    //   formData.price = ((this.basicDetailsForm.value.price).replace(".", ''))
    //   if (formData.price.includes(',')) {
    //     formData.price = ((formData.price).replace(",", ''))
    //   } else {
    //     formData.price = formData.price
    //   }
    // } else {
    //   formData.price = this.basicDetailsForm.value.price
    // }
    // // this.basicDetailsForm.value.price = parseFloat((this.basicDetailsForm.value.price).replace(",",''))
    // // formData.price = parseInt((this.basicDetailsForm.value.price).replace(".", ''))
    // // console.log(formData)
    // // formData.price = formData.price.replace(/,/g, '')

    let price = this.basicDetailsForm.value.price.replaceAll('.', '');
    formData.price = price.replaceAll(',', '.');
    let distance_travelled = this.basicDetailsForm.value.distance_travelled.replaceAll('.', '');
    formData.distance_travelled = distance_travelled.replaceAll(',', '.');
    let engine_size = this.specificationsForm.value.engine_size.replaceAll('.', '');
    formData.engine_size = engine_size.replaceAll(',', '.');

    formData.comforts = this.comforts;
    formData.entertainments = this.entertainments;
    formData.technologies = this.technologies;
    formData.utilities = this.utilities;
    formData.securities = this.securities;
    if (this.vehicleId) {
      formData.vehicle_id = this.vehicleId;
      delete formData.is_draft;
    }
    let filterdata = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== '' && value !== null
      )
    );
    this.loading = true;
    this.dataSubmitting = true;

    const addUpdateVehicle = this.vehicleId
      ? this.dealerVehiclesService.updateDealerVehicle(filterdata)
      : this.dealerVehiclesService.postDealerAddVehicle(filterdata);
    addUpdateVehicle.subscribe(
      (response) => {
        this.submitting = false;
        this.specificationsForm.reset();
        this.basicDetailsForm.reset();
        localStorage.removeItem('vehicleObj');
        this.dataSubmitting = false;

        this.loading = false;
        const modalRef = this.modalService.open(SuccessfullComponent);
        if (this.vehicleId) {
          modalRef.componentInstance.editedSuccess = true;
        } else {
          if (draft) {
            this.vehicleId = response.data.id;
            modalRef.componentInstance.draftSuccess = true;
          } else {
            this.vehicleId = response.data.id;
            modalRef.componentInstance.submittedForApproval = true;
          }
        }
      },
      ({ error, status }) => {
        this.submitting = false;
        this.loading = false;
        this.dataSubmitting = false;

        this.err = error;
        this.errStatus = status;
        this.errMessage = error?.message;
        if (error.error) {
          error.error.forEach((message: any) => {
            this.toastr.error(message);
          });
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  onPrimaryPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      const totalBytes = event.target.files[0].size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 5120) {
        this.toastr.error(this.translate.instant('Image size must be smaller than 5 MB'));
        return;
      }
      const fileType = event.target.files[0].type;
      if (fileType != 'image/png' && fileType != 'image/jpeg' && fileType != 'image/jpg' ) {
        this.toastr.error(this.translate.instant("Allowed file types are only PNG, JPEG and JPG"));
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.isImageUploading = true;
        this.getPreSignedUrl(event.target.files[0]).catch((error) => {
          this.isImageUploading = false;
          return;
        });
      };
    }
  }

  deletePrimaryPhoto() {
    this.primaryPhotoName = null;
    this.primaryPhotoUrl = null;
    this.vehicleImagesAndDocuments['cover_img_asset_url'] = null;
  }

  deleteOtherPhotos(index: number) {
    this.otherPhotoUrls.splice(index, 1);
    this.vehicleImagesAndDocuments['other_img_asset_urls'].splice(index, 1);
  }

  async onOtherPhotosChange(event: any) {
    let files = event.target.files;
    if (files) {
      const numberOfUploads =
        event.target.files.length + this.otherPhotoUrls.length;
      if (numberOfUploads > 30) {
        this.toastr.error(this.translate.instant(`Maximum 30 images are allowed to upload`));
        return;
      }
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('Image size must be smaller than 5 MB'));
          this.isAdditionalImagesUploading = false;
          return;
        }
        const fileType = file.type;
        if (fileType != 'image/png' && fileType != 'image/jpeg' && fileType != 'image/jpg' ) {
          this.toastr.error(this.translate.instant("Allowed file types are only PNG, JPEG and JPG"));
          return;
        }
        this.isAdditionalImagesUploading = true;
        await this.getPreSignedUrl(file, 'other_photos', index, files.length)
          .then((success) => {
            if (success) {
              if (index == files.length - 1) {
                this.isAdditionalImagesUploading = false;
              }
            }
            index++;
          })
          .catch((error) => {
            this.isAdditionalImagesUploading = false;
            return;
          });
      }
    }
  }

  async getPreSignedUrl(
    file: any,
    inputName: string = 'cover_image',
    index = 0,
    totalFiles = 0
  ) {
    try {
      return new Promise((resolve, reject) => {
        this.addVehicleService
          .getPreSignedUrl({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
          })
          .subscribe(
            async (res) => {
              if (res) {
                if (inputName == 'cover_image') {
                  await this.addVehicleService
                    .uploadImage(res.data.url, file)
                    .subscribe((data) => {
                      this.vehicleImagesAndDocuments['cover_img_asset_url'] =
                        res.data.key;
                      this.primaryPhotoName = file.name;
                      this.primaryPhotoUrl = res.data.download_url;
                      this.isImageUploading = false;
                      resolve(true);
                    });
                } else {
                  await this.addVehicleService
                    .uploadImage(res.data.url, file)
                    .subscribe((data) => {
                      this.vehicleImagesAndDocuments[
                        'other_img_asset_urls'
                      ].push(res.data.key);
                      this.otherPhotoUrls.push({
                        src: res.data.download_url,
                        name: file.name,
                      });
                      resolve(true);
                    });
                }
              }
            },
            (error) => {
              if (error.error[0]) {
                this.toastr.error(error.error[0]);
              } else {
                this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              }
              reject(false);
            }
          );
      });
    } catch (ex) { }
  }

  formatNumberPlate(event: any) {
    if (event.target.value.length >= 4) {
      const numberPlate = event.target.value
        ? (
          event.target.value.slice(0, 3) +
          '-' +
          event.target.value.slice(4)
        ).toUpperCase()
        : '';
      this.basicDetailControls['number_plate'].setValue(numberPlate);
    } else if (event.target.value) {
      this.basicDetailControls['number_plate'].setValue(event.target.value);
    }
  }

  setProvice(province: string) {
    this.basicDetailControls['province'].setValue(province);
    this.searchProvince = '';
    this.parishList = [];
    this.basicDetailControls['city'].setValue('');
    this.basicDetailControls['parish'].setValue('');
    this.addVehicleService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.basicDetailControls['city'].setValue(city);
    this.basicDetailControls['parish'].setValue('');
    this.searchCity = '';
    this.addVehicleService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.basicDetailControls['parish'].setValue(parish);
    this.searchParish = '';
  }

  newUsedVehicleFormChanges() {
    const date = new Date();
    const currentYear: any = date.getFullYear();
    if (this.vehicleCondition == 'new') {
      this.basicDetailsForm.controls['number_plate'].clearValidators();
      this.basicDetailsForm.controls['registration_year'].clearValidators();
      this.basicDetailsForm.controls['number_plate'].updateValueAndValidity();
      this.basicDetailsForm.controls[
        'registration_year'
      ].updateValueAndValidity();
      // this.basicDetailsForm.controls['distance_travelled'].setValue(0)
    } else if (this.vehicleCondition == 'used') {
      this.basicDetailsForm.controls['number_plate'].clearValidators();
      this.basicDetailsForm.controls['registration_year'].clearValidators();
      this.basicDetailsForm.controls['number_plate'].setValidators([
        Validators.required,
        Validators.pattern('^[A-Z, a-z]{1,3}-[0-9]{1,4}$'),
      ]);
      this.basicDetailsForm.controls['registration_year'].setValidators([
        Validators.required,
        Validators.maxLength(4),
        Validators.min(1980),
        Validators.max(parseInt(currentYear) + 1),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
      ]);
      this.basicDetailsForm.controls['number_plate'].updateValueAndValidity();
      this.basicDetailsForm.controls[
        'registration_year'
      ].updateValueAndValidity();
      if (this.vehicleDetail?.distance_travelled) this.basicDetailsForm.controls['distance_travelled'].setValue(this.vehicleDetail.distance_travelled)
    }
  }

  formatPrice(event: any, key:string) {
    if (event.target.value && event.target.value.trim() != '') {
     let value = event.target.value.replace(/,/g, '');
      value = Intl.NumberFormat('es').format(value);
     // let value = parseFloat(event.target.value).toLocaleString('es');
      if(key != 'engine_size'){
        this.basicDetailsForm.get(key)?.setValue(value)
      }else{
        this.specificationsForm.get(key)?.setValue(value);
      }
    }
  }

  formatToNumber(event: any, key:string){
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');
      if (key != 'engine_size') {
        this.basicDetailsForm.get(key)?.setValue(value)
      } else {
        this.specificationsForm.get(key)?.setValue(value);
      }
    }
  }
  // distanceTravelled(event: any) {
  //   if (event.target.value && event.target.value.trim() != '') {
  //     let value = event.target.value.replace(/,/g, '');
  //     value = Intl.NumberFormat('es').format(value)
  //     // value = parseFloat(value).toLocaleString('es');
  //     this.basicDetailsForm.get('distance_travelled')?.setValue(value);
  //   }
  // }

  /*convertToDecimal(e: any){
    this.specificationsForm.controls['passanger_doors'].setValue(
      this.decimalPipe.transform(this.specificationsForm.value.mileage, '2.2-5') ?? '0'
    );
  }*/

}
