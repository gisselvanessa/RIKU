import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ArrayHelper } from 'src/app/shared/helpers/array-helper';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { AccordianName } from '../../../report.mode';


@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VehicleInformationComponent implements OnInit {

  constructor(private fb: FormBuilder, private translate: TranslateService, private addVehicleService: AddVehicleService, private toastr: ToastrService) { }

  @Input() isSave = false;
  @Input() appraisallDetails: any;
  @Input() statusOfReview: string;
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  @Input() selectAccordian: string;
  @Output() selectedAccordian: EventEmitter<any> = new EventEmitter();
  @Input() stepsCompleted: any;
  accordianName = AccordianName;
  accordianOpen = false;
  selectedInsurance: any;
  selectedInsuranceId: any;

  vehicleInformationForm: FormGroup;
  insuranceOption = [{ id: 'yes', name: 'Yes' }, { id: 'no', name: 'No' }]
  serviceOption = [{ id: 'public', name: 'Public' }, { id: 'private', name: 'Private' }, { id: 'commercial', name: 'Commercial' }]
  selectedService: any;
  selectedServiceId: any;

  hasLienOption = [{ valueId: "Yes", value: 'Yes' }, { valueId: "No", value: 'No' }];
  selectedLien: any;
  selectedLienId: any;

  classOption = [{ id: 'sedan', value: 'Sedan' }, { id: 'coupe', value: 'Coupe' }, { id: 'convertible', value: 'Convertible' }, { id: 'hatchback', value: 'Hatchback' }, { id: 'station_wagon', value: 'Station Wagon' }, { id: 'minivan', value: 'Minivan' }, { id: 'utilitario', value: 'Utilitario' }, { id: 'limosina', value: 'Limosina' }, { id: 'funeraria', value: 'Funeraria' }, { id: 'camioneta', value: 'Camioneta' }, { id: 'furgoneta_de_pasajeros', value: 'Furgoneta de pasajeros' }, { id: 'furgoneta_de_carga', value: 'Furgoneta de carga' }, { id: 'ambulancia', value: 'Ambulancia' }, { id: 'microbus', value: 'Microbus' }, { id: 'mini_bus', value: 'Mini bus' }, { id: 'bus', value: 'Bus' }, { id: 'bus_de_dos_pisos', value: 'Bus de dos pisos' }, { id: 'bus_costa', value: 'Bus Costa' }, { id: 'articulado', value: 'Articulado' }, { id: 'camion_ligero', value: 'Camion ligero' }, { id: 'camion_mediano', value: 'Camion Mediano' }, { id: 'camion_pesado', value: 'Camion pesado' }, { id: 'tractor_camion', value: 'Tractor camion' }, { id: 'semirremolque', value: 'Semirremolque' }, { id: 'remolque', value: 'Remolque' }, { id: 'casa_rodante', value: 'Casa rodante' }, { id: 'chasis_motorizado', value: 'Chasis Motorizado' }, { id: 'chasis_cabinado', value: 'Chasis Cabinado' }]

  selectedClass: any;
  selectedClassId: any;

  selectedVehicleMake: string = '';
  numberPlate: any;
  formSubmitted: boolean = false;
  makeId: any;
  modelId: any;
  submitted: boolean
  selectedVehicleMakeYear: string = '';
  selectedVehicleModel: string = '';
  vehicleTypes: any[] = [];
  vehicleMakes: any[] = [];
  popularMakes: any[] = [];
  nonPopularMakes: any[] = [];
  vehicleMakeYears: any[] = [];
  vehicleModels: any[] = [];
  ngOnInit(): void {
    this.vehicleInformationFormControls()
    this.getVehicleMake();
  }


  selectValue(event: any, value: any, field: any) {
    if (field === 'Insurance') {
      this.selectedInsuranceId = event.target.value
      this.selectedInsurance = value
    } else if (field === 'service') {
      this.selectedServiceId = event.target.value
      this.selectedService = value
    } else if (field === 'lien') {
      this.selectedLienId = event.target.value
      this.selectedLien = value
    } else if (field === 'class') {
      this.selectedClassId = event.target.value
      this.selectedClass = value;
    }
  }


  public getVehicleMake() {
    this.vehicleMakeYears = [];
    this.vehicleModels = [];
    this.selectedVehicleMake = '';
    this.selectedVehicleMakeYear = '';
    this.selectedVehicleModel = '';
    let url_param = {};
    this.addVehicleService.getMake(url_param).subscribe((res: any) => {
      this.vehicleMakes = res.data;
      this.popularMakes = ArrayHelper.getArrayChunks(res.data.filter((x: any) => x.is_popular), 4)
      this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      });
  }

  public getVehicleMakeYear(make_id: any, make_name: any) {
    this.vehicleInformationForm.controls['make'].setValue(make_name)
    this.vehicleModels = [];
    this.selectedVehicleMakeYear = '';
    this.selectedVehicleModel = '';
    this.vehicleInformationForm.controls['year'].setValue('')
    this.vehicleInformationForm.controls['model'].setValue('')
    this.addVehicleService.getMakeYears(make_id).subscribe((res: any) => {
      this.makeId = make_id;
      this.vehicleMakeYears = res.data.years;
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      });
  }

  public getVehicleModel(year: any, vehicleMakeYear: any) {
    this.vehicleInformationForm.controls['year'].setValue(vehicleMakeYear)
    this.vehicleInformationForm.controls['model'].setValue('')
    this.selectedVehicleModel = '';
    this.addVehicleService.getModels(this.makeId, year).subscribe((res: any) => {
      this.vehicleModels = res.data;
    },
      (error: any) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      });
  }

  public setVehicleModel(modelId: string, modelName: string) {
    this.modelId = modelId;
    this.vehicleInformationForm.controls['model'].setValue(modelName)
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
      }
    } else if (filterKey == 'year') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
      }
    }
  }


  vehicleInformationFormControls() {
    if (this.appraisallDetails != null) {
      this.vehicleInformationForm = this.fb.group({
        make: [this.appraisallDetails.make, Validators.required],
        model: [this.appraisallDetails.model, Validators.required],
        year: [this.appraisallDetails.year, Validators.required],
        number_plate: [this.appraisallDetails.number_plate, [Validators.required, Validators.pattern('^[A-Z, a-z]{1,3}-[0-9]{1,4}$')]],
        color_1: [this.appraisallDetails.color_1, Validators.required],
        color_2: [this.appraisallDetails.color_2],
        class: [this.appraisallDetails.class, Validators.required],
        service: [this.appraisallDetails.service, Validators.required],
        country_of_origin: [this.appraisallDetails.country_of_origin, Validators.required],
        // cylinder_number: [this.appraisallDetails.cylinder_number, Validators.required],
        transmission: [this.appraisallDetails.transmission, Validators.required],
        vin: [this.appraisallDetails.vin, Validators.required],
        engine_number: [this.appraisallDetails.engine_number, Validators.required],
        insurance: [this.appraisallDetails.insurance, Validators.required],
        has_lien: [this.appraisallDetails.has_lien, Validators.required],
        current_step: ['VEHICLE_INFO']
      })
      this.selectedClass = this.appraisallDetails.class
      this.selectedInsurance = this.appraisallDetails.insurance
      this.selectedLien = this.appraisallDetails.has_lien
      this.selectedService = this.appraisallDetails.service
    } else if (this.appraisallDetails == null) {
      const vehicleInformation = JSON.parse(localStorage.getItem('vehicleInformation')!)
      this.vehicleInformationForm = this.fb.group({
        make: [vehicleInformation.make, Validators.required],
        model: [vehicleInformation.model, Validators.required],
        year: [vehicleInformation.year, Validators.required],
        number_plate: [vehicleInformation.number_plate, [Validators.required, Validators.pattern('^[A-Z, a-z]{1,3}-[0-9]{1,4}$')]],
        color_1: ['', Validators.required],
        color_2: [''],
        class: ['', Validators.required],
        service: ['', Validators.required],
        country_of_origin: ['', Validators.required],
        // cylinder_number: ['', Validators.required],
        transmission: ['', Validators.required],
        vin: ['', Validators.required],
        engine_number: ['', Validators.required],
        insurance: ['', Validators.required],
        has_lien: ['', Validators.required],
        current_step: ['VEHICLE_INFO']
      })
    }
  }

  submitVehicleInformation() {
    let formData: any = {}
    this.submitted = true;
    formData.make = this.vehicleInformationForm.controls['make'].value
    formData.model = this.vehicleInformationForm.controls['model'].value
    formData.year = this.vehicleInformationForm.controls['year'].value
    formData.number_plate = this.vehicleInformationForm.controls['number_plate'].value
    formData.color_1 = this.vehicleInformationForm.controls['color_1'].value
    if (this.vehicleInformationForm.controls['color_2'].value) {
      formData.color_2 = this.vehicleInformationForm.controls['color_2'].value
    }
    formData.class = this.vehicleInformationForm.controls['class'].value
    formData.service = this.vehicleInformationForm.controls['service'].value
    formData.country_of_origin = this.vehicleInformationForm.controls['country_of_origin'].value
    formData.transmission = this.vehicleInformationForm.controls['transmission'].value
    formData.vin = this.vehicleInformationForm.controls['vin'].value
    formData.engine_number = this.vehicleInformationForm.controls['engine_number'].value
    formData.insurance = this.vehicleInformationForm.controls['insurance'].value
    formData.has_lien = this.vehicleInformationForm.controls['has_lien'].value
    formData.current_step = this.vehicleInformationForm.controls['current_step'].value
    this.vehicleInformationForm.markAllAsTouched();
    if (this.vehicleInformationForm.invalid) return;
    this.saveData.emit(formData);
  }


  selectedAccordians() {
    this.accordianOpen = !this.accordianOpen;
    const accordianName = this.accordianOpen ? this.accordianName.VehicleInformation : null;
    this.selectedAccordian.emit(accordianName)
  }

  resetMakes() {
    this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
    this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
  }


  public formatNumberPlate(event: any) {
    if (event.target.value.length >= 4) {
      const numberPlate = event.target.value
        ? (
          event.target.value.slice(0, 3) +
          '-' +
          event.target.value.slice(4)
        ).toUpperCase()
        : '';
      this.vehicleInformationForm.controls['number_plate'].setValue(numberPlate);
    } else if (event.target.value) {

      this.vehicleInformationForm.controls['number_plate'].setValue(event.target.value);
    }
  }
}
