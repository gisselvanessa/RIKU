import { Location } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { LoanStages, LoanStepsNumber } from 'src/app/shared/constant/loan-constants';
import { Error } from 'src/app/shared/models/error.model';
import { isValidCedulaId, isValidSSN } from '../../loan-helper';
import { LoanProcedureService } from '../../loan-procedure.service';
import { AccordianName } from '../accordian.model';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';

@Component({
  selector: 'app-co-applicant',
  templateUrl: './co-applicant.component.html',
  styleUrls: ['./co-applicant.component.scss']
})
export class CoApplicantComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(private fb: FormBuilder, private translate: TranslateService, private loanProcedureService: LoanProcedureService, private location: Location, private render: Renderer2, private ngZone: NgZone, private toastr: ToastrService, private addAddressService:AddVehicleService) {

  }

  @ViewChild('address') address: any;
  @ViewChild('workPlace') workPlace: any;
  accordianOpen: Array<any> = [false, false, false];
  isSubmitted: boolean = false;
  accordianName = AccordianName;
  selectedAccordian: any = this.accordianName.PERSONALINFORMATION;
  maxDate = new Date();
  today = new Date();
  latitude: any;
  longitude: any;
  isOpened: boolean = true;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  @Input() currentLoanId: any;
  @Input() currentStep: number;
  @Input() currentLoanDetail: any
  @Output() onSubmitApplicantDetails: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];


  provinceList: any = [];
  cityList: any = [];
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList: Array<string> = [];

  maritalOptions = [{ id: 'single', value: 'Single' }, { id: 'married', value: 'Married' }, { id: 'widow_or_widower', value: 'Widow/Widower' }, { id: 'divorced', value: 'Divorce' }, { id: 'separated', value: 'Separated' }]
  selectedStatus: any;
  selectedStatusId: any;

  assetsOptions = [{ id: true, value: 'Yes' }, { id: false, value: 'No' }]
  selectedSOA: any;
  selectedSOAId: boolean;

  sexOptions = [{ id: 'male', value: 'Male' }, { id: 'female', value: 'Female' }, { id: 'other', value: 'Other' }]
  selectedSex: any;
  selectedSexId: any;

  educationOptions = [{ id: 'primary', value: 'Primary' }, { id: 'high_school', value: 'High School' }, { id: 'bachelor', value: 'Bachelor' }, { id: 'degree', value: 'Degree' }, { id: 'masters', value: 'Masters' }, { id: 'technologist', value: 'Technologist' }, { id: 'nothing', value: 'Nothing' }]
  selectedEducation: any;
  selectedEducationId: any;

  NfcOptions = [{id:'0', value:'00'},{ id: '1', value: '01' }, { id: '2', value: '02' }, { id: '3', value: '03' }, { id: '4', value: '04' }, { id: '5', value: '05' }, { id: '6', value: '06' }, { id: '7', value: '07' }, { id: '8', value: '08' }, { id: '9', value: '09' }]
  selectedNfc: any;
  selectedNfcId: any;

  nationalityOptions = [{ id: "ecudorian", value: 'Ecudorian', val1: false }, { id: "foreigner", value: 'Foreigner', val1: true }]
  selectedNationality: any;
  selectedNationalityId: any;


  homeSatusOptions = [{ id: 'own', value: 'Own' }, { id: 'rented', value: 'Rented' }, { id: 'familiar', value: 'Familiar' }, { id: 'with_mortgage', value: 'With Mortgage' }]
  selectedHomeStatus: any;
  selectedHomeStatusId: any;

  // employmentTypeOptions = [{ id: 'employed', value: 'Employed' }, { id: 'self_employed', value: 'Self-Employed RUC/RIMPE' }, { id: 'retired', value: 'Retired' }]
  // selectedEmploymentType: any;
  // selectedEmploymentTypeId: any;

  employmentTypeOptions = [{ id: 'employed', value: 'Employed' }, { id: 'self_employed', value: 'Self-Employed RUC/RIMPE' }]
  selectedEmploymentType: any;
  selectedEmploymentTypeId: any;


  typeOfContract = [{ id: 'indefinite', value: 'Indefinite' }, { id: 'fixed_term', value: 'Fixed Term' }, { id: 'civil_court', value: 'Civil contract' }, { id: 'test_contract', value: 'Test contract' }]
  selectedTypeOfContract: any;
  selectedTypeOfContractId: any;

  // jobTitleOptions = [{ id: 'teacher', value: 'Teacher' }, { id: 'doctor', value: 'Doctor' }, { id: 'lawyer', value: 'Lawyer' }, { id: 'engineer', value: 'Engineer' }, { id: 'natural_sciences', value: 'Natural Sciences' }, { id: 'human_sciences', value: 'Human Sciences' }, { id: 'physical_sciences', value: 'Physical Sciences' }, { id: 'economic_sciences', value: 'Economic Sciences' }, { id: 'engineering', value: 'Engineering' }, { id: 'arts_and_media', value: 'Arts and Media' }]
  // selectedJobTitle: any;
  // selectedJobTitleId: any;

  typeOfEstablishmentOptions = [{ id: 'own_establishment', value: 'Own', id1: 'own' }, { id: 'rented_establishment', value: 'Rented', id1: 'rented' }, { id: 'businessman_establishment', value: 'Businessman', id1: 'businessman' }]
  selectedTypeOfEstablishment: any;
  selectedTypeOfEstablishmentId: any;

  economicActivityOptions = [{ id: 'agriculture', value: 'Agriculture, livestock, forestry and related service activities', ecoValue: 'Agriculture, livestock, forestry and related service activities' }, { id: 'mining_and_quarrying', value: 'Mining and quarrying', ecoValue: 'Mining and quarrying' }, { id: 'manufacturing', value: 'Manufacturing', ecoValue: 'Manufacturing' }, { id: 'water_supply', value: 'Water supply, sewerage, waste management and sanitation activities', ecoValue: 'Water supply, sewerage, waste management and sanitation activities' }, { id: 'construction', value: 'Construction', ecoValue: 'Construction' }, { id: 'wholesale_and_retail_trade', value: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles', ecoValue: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles' }, { id: 'accomdation_and_food_services', value: 'Accommodation and food services', ecoValue: 'Accommodation and food services' }, { id: 'transport_and_storage', value: 'Transport and storage', ecoValue: 'Transport and storage' }, { id: 'information_and_communication', value: 'Information and communication', ecoValue: 'Information and communication' }, { id: 'financial_and_insurance', value: 'Financial and insurance', ecoValue: 'Financial and insurance' },
  { id: 'real_estate', value: 'Real estate', ecoValue: 'Real estate' }, { id: 'professional', value: 'Professional, technical and administrative activities and private households with domestic service', ecoValue: 'Professional, technical and administrative activities and private households with domestic service' },

  { id: 'teaching', value: 'Teaching', ecoValue: 'Teaching' }, { id: 'social_service', value: 'Social service', ecoValue: 'Social service' }, { id: 'entertainment', value: 'Entertainment, recreation and other service activities', ecoValue: 'Entertainment, recreation and other service activities' }, { id: 'retail_trade_except_vehicles', value: 'Retail trade, except vehicles', ecoValue: 'Retail trade, except vehicles' }, { id: 'wholesale_trade_except_vehicles', value: 'Wholesale trade, except vehicles', ecoValue: 'Wholesale trade, except vehicles' }]
  selectedEconomicActivity: any;
  selectedEconomicActivityId: any;
  sendAdditionalEconomicActivity: any;

  rucrimpeOptions = [{ id: 'ruc', value: 'RUC' }, { id: 'rimpe', value: 'RIMPE' }]
  selectedrucrimpe: any;
  selectedrucrimpeId: any;

  dependencyRelationships = [{ id: 'dependant', value: 'Dependent' }, { id: 'independent', value: 'Independent' }]
  selectedDependency: any;
  selectedDependencyId: any;

  // dependencyRelationshipsEmployment = [{ id: 'dependent_employment', value: 'Dependent' }, { id: 'independent_employment', value: 'Independent' }]
  // selectedDependencyEmployement: any;
  // selectedDependencyEmployementId: any;

  typesOfBusinesses = [{ id: 'public', value: 'Public' }, { id: 'private', value: 'Private' }, { id: 'mixed_used', value: 'Mixed Used' }]
  selectedtypeOfBusiness: any;
  selectedtypeOfBusinessId: any;


  businessActivities = [{ id: 'commercial', value: 'Commercial' }, { id: 'industrial', value: 'Industrial' }, { id: 'agricultural', value: 'Agricultural' }, { id: 'service', value: 'Service' }, { id: 'others', value: 'Others' }]
  selectedBusinessActivity: any;
  selectedBusinessActivityId: any;


  sizeOfCompanyOptions = [{ id: 'large', value: 'Large' }, { id: 'medium', value: 'Medium' }, { id: 'small', value: 'Small' }]
  selectedSizeOfCompany: any;
  selectedSizeOfCompanyId: any;



  economicAdditionalActivityOptions1 = [{ id: 'additional_agriculture_1', value: 'Agriculture, livestock, forestry and related service activities', ecoValue1: 'Agriculture, livestock, forestry and related service activities' }, { id: 'additional_mining_and_quarrying_1', value: 'Mining and quarrying', ecoValue1: 'Mining and quarrying' }, { id: 'additional_manufacturing_1', value: 'Manufacturing', ecoValue1: 'Manufacturing' }, { id: 'additional_water_supply_1', value: 'Water supply, sewerage, waste management and sanitation activities', ecoValue1: 'Water supply, sewerage, waste management and sanitation activities' }, { id: 'additional_construction_1', value: 'Construction', ecoValue1: 'Construction' }, { id: 'additional_wholesale_and_retail_trade_1', value: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles', ecoValue1: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles' }, { id: 'additional_accomdation_and_food_services_1', value: 'Accommodation and food services', ecoValue1: 'Accommodation and food services' }, { id: 'additional_transport_and_storage_1', value: 'Transport and storage', ecoValue1: 'Transport and storage' }, { id: 'additional_information_and_communication_1', value: 'Information and communication', ecoValue1: 'Information and communication' }, { id: 'additional_financial_and_insurance_1', value: 'Financial and insurance', ecoValue1: 'Financial and insurance' }, { id: 'additional_real_estate_1', value: 'Real estate', ecoValue1: 'Real estate' }, { id: 'additional_professional_1', value: 'Professional, technical and administrative activities and private households with domestic service', ecoValue1: 'Professional, technical and administrative activities and private households with domestic service' }, { id: 'additional_teaching_1', value: 'Teaching', ecoValue1: 'Teaching' }, { id: 'additional_social_service_1', value: 'Social service', ecoValue1: 'Social service' }, { id: 'additional_entertainment_1', value: 'Entertainment, recreation and other service activities', ecoValue1: 'Entertainment, recreation and other service activities' }, { id: 'additional_retail_trade_except_vehicles_1', value: 'Retail trade, except vehicles', ecoValue1: 'Retail trade, except vehicles' }, { id: 'additional_wholesale_trade_except_vehicles_1', value: 'Wholesale trade, except vehicles', ecoValue1: 'Wholesale trade, except vehicles' },]
  selectedAdditionalEconomicActivity1: any;
  selectedAdditionalEconomicActivityId1: any;
  sendAdditionalEconomicActivity1: any;


  economicAdditionalActivityOptions2 = [{ id: 'additional_agriculture_2', value: 'Agriculture, livestock, forestry and related service activities', ecoValue2: 'Agriculture, livestock, forestry and related service activities' }, { id: 'additional_mining_and_quarrying_2', value: 'Mining and quarrying', ecoValue2: 'Mining and quarrying' }, { id: 'additional_manufacturing_2', value: 'Manufacturing', ecoValue2: 'Manufacturing' }, { id: 'additional_water_supply_2', value: 'Water supply, sewerage, waste management and sanitation activities', ecoValue2: 'Water supply, sewerage, waste management and sanitation activities' }, { id: 'additional_construction_2', value: 'Construction', ecoValue2: 'Construction' }, { id: 'additional_wholesale_and_retail_trade_2', value: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles', ecoValue2: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles' }, { id: 'additional_accomdation_and_food_services_2', value: 'Accommodation and food services', ecoValue2: 'Accommodation and food services' }, { id: 'additional_transport_and_storage_2', value: 'Transport and storage', ecoValue2: 'Transport and storage' }, { id: 'additional_information_and_communication_2', value: 'Information and communication', ecoValue2: 'Information and communication' }, { id: 'additional_financial_and_insurance_2', value: 'Financial and insurance', ecoValue2: 'Financial and insurance' }, { id: 'additional_real_estate_2', value: 'Real estate', ecoValue2: 'Real estate' }, { id: 'additional_professional_2', value: 'Professional, technical and administrative activities and private households with domestic service', ecoValue2: 'Professional, technical and administrative activities and private households with domestic service' }, { id: 'additional_teaching_2', value: 'Teaching', ecoValue2: 'Teaching' }, { id: 'additional_social_service_2', value: 'Social service', ecoValue2: 'Social service' }, { id: 'additional_entertainment_2', value: 'Entertainment, recreation and other service activities', ecoValue2: 'Entertainment, recreation and other service activities' }, { id: 'additional_retail_trade_except_vehicles_2', value: 'Retail trade, except vehicles', ecoValue2: 'Retail trade, except vehicles' }, { id: 'additional_wholesale_trade_except_vehicles_2', value: 'Wholesale trade, except vehicles', ecoValue2: 'Wholesale trade, except vehicles' },]
  selectedAdditionalEconomicActivity2: any;
  selectedAdditionalEconomicActivityId2: any;
  sendAdditionalEconomicActivity2: any


  economicAdditionalActivityOptions3 = [{ id: 'additional_agriculture_3', value: 'Agriculture, livestock, forestry and related service activities', ecoValue3: 'Agriculture, livestock, forestry and related service activities' }, { id: 'additional_mining_and_quarrying_3', value: 'Mining and quarrying', ecoValue3: 'Mining and quarrying' }, { id: 'additional_manufacturing_3', value: 'Manufacturing', ecoValue3: 'Manufacturing' }, { id: 'additional_water_supply_3', value: 'Water supply, sewerage, waste management and sanitation activities', ecoValue3: 'Water supply, sewerage, waste management and sanitation activities' }, { id: 'additional_construction_3', value: 'Construction', ecoValue3: 'Construction' }, { id: 'additional_wholesale_and_retail_trade_3', value: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles', ecoValue3: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles' }, { id: 'additional_accomdation_and_food_services_3', value: 'Accommodation and food services', ecoValue3: 'Accommodation and food services' }, { id: 'additional_transport_and_storage_3', value: 'Transport and storage', ecoValue3: 'Transport and storage' }, { id: 'additional_information_and_communication_3', value: 'Information and communication', ecoValue3: 'Information and communication' }, { id: 'additional_financial_and_insurance_3', value: 'Financial and insurance', ecoValue3: 'Financial and insurance' }, { id: 'additional_real_estate_3', value: 'Real estate', ecoValue3: 'Real estate' }, { id: 'additional_professional_3', value: 'Professional, technical and administrative activities and private households with domestic service', ecoValue3: 'Professional, technical and administrative activities and private households with domestic service' }, { id: 'additional_teaching_3', value: 'Teaching', ecoValue3: 'Teaching' }, { id: 'additional_social_service_3', value: 'Social service', ecoValue3: 'Social service' }, { id: 'additional_entertainment_3', value: 'Entertainment, recreation and other service activities', ecoValue3: 'Entertainment, recreation and other service activities' }, { id: 'additional_retail_trade_except_vehicles_3', value: 'Retail trade, except vehicles', ecoValue3: 'Retail trade, except vehicles' }, { id: 'additional_wholesale_trade_except_vehicles_3', value: 'Wholesale trade, except vehicles', ecoValue3: 'Wholesale trade, except vehicles' },]
  selectedAdditionalEconomicActivity3: any;
  selectedAdditionalEconomicActivityId3: any;
  sendAdditionalEconomicActivity3: any
  applicantInformationForm: FormGroup;
  filteredeconomicAdditionalActivityOptions1:any[] = this.economicAdditionalActivityOptions1
  filteredeconomicAdditionalActivityOptions2:any[] = this.economicAdditionalActivityOptions2
  filteredeconomicAdditionalActivityOptions3:any[] = this.economicAdditionalActivityOptions3




  ngOnInit(): void {
    this.today.setFullYear(new Date().getFullYear() - 18);
    this.createApplicantForm()
  }

  back() {
    this.location.back()
  }


  createApplicantForm() {
    this.addAddressService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
    if (this.currentLoanDetail.co_applicant_info != null) {
      const coApplicantPerosnalData = this.currentLoanDetail.co_applicant_info.personal_info;
      const coApplicantAddressData = this.currentLoanDetail.co_applicant_info.address_info;
      const coApplicantEmploymentData = this.currentLoanDetail.co_applicant_info.employment_info;
      const mobileNumber = coApplicantPerosnalData.country_code + coApplicantPerosnalData.mobile_no
      this.applicantInformationForm = this.fb.group({
        cedula_id: [this.currentLoanDetail.co_applicant_info.cedula_id, Validators.required],
        full_name: [coApplicantPerosnalData.full_name, Validators.required],
        dob: [new Date(coApplicantPerosnalData.dob), Validators.required],
        marital_status: [coApplicantPerosnalData.marital_status, Validators.required],
        separation_of_assets: [coApplicantPerosnalData.is_separation_of_assets, Validators.required],
        email: [coApplicantPerosnalData.email, [Validators.required, Validators.pattern(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
        )]],
        sex: [coApplicantPerosnalData.sex, [Validators.required]],
        education_level: [coApplicantPerosnalData.education_level, Validators.required],
        number_family_charges: [coApplicantPerosnalData.no_of_family_charges, Validators.required],
        mobile_number: [mobileNumber, Validators.required],
        dependent_relationship: [coApplicantPerosnalData.dependency_relationship, Validators.required],
        nationality: [coApplicantPerosnalData.is_foreigner, Validators.required],
        address: [coApplicantAddressData.address, Validators.required],
        additional_address: [coApplicantAddressData.additional_address],
        province: [coApplicantAddressData.province, Validators.required],
        city: [coApplicantAddressData.city, Validators.required],
        parish: [coApplicantAddressData.parish, Validators.required],
        neighborhood: [coApplicantAddressData.neighborhood, Validators.required],
        zip_code: [coApplicantAddressData.zip_code],
        home_status: [coApplicantAddressData.home_status, Validators.required],
        move_in_date: [new Date(coApplicantAddressData.move_in_date), Validators.required],
        employment_type: [coApplicantEmploymentData.type, Validators.required],
        type_of_business: [coApplicantEmploymentData.business_type, Validators.required],
        company_name: [coApplicantEmploymentData.company_name, Validators.required],
        // job_title: [coApplicantEmploymentData.job_title],
        start_date_job: [new Date(coApplicantEmploymentData.start_date_job)],
        type_of_contract: [coApplicantEmploymentData.contract_type],
        size_of_company: [coApplicantEmploymentData.company_size, Validators.required],
        position: [coApplicantEmploymentData.position],
        business_activity: [coApplicantEmploymentData.business_activities, Validators.required],
        place_of_work: [coApplicantEmploymentData.address, Validators.required],
        monthly_income: [(coApplicantEmploymentData.monthly_income.toLocaleString('es')), [Validators.required,Validators.pattern('^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$')]],
        type_of_establishment: [coApplicantEmploymentData.establishment_type],
        select_ruc_rimpe: [coApplicantEmploymentData.document_type],
        number_of_your_ruc_rimpe: [coApplicantEmploymentData.document_value],
        economic_activity: [coApplicantEmploymentData.economic_activity, Validators.required],
        company_phone_no: [coApplicantEmploymentData.company_mobile_no],
        entry_date: [new Date(coApplicantEmploymentData.entry_date)],
        // retired_since: [new Date(coApplicantEmploymentData.retired_since)],
        economic_activity_income_1: [coApplicantEmploymentData.additional_income_1_type],
        monthly_income_1: [],
        economic_activity_income_2: [coApplicantEmploymentData.additional_income_2_type],
        monthly_income_2: [],
        economic_activity_income_3: [coApplicantEmploymentData.additional_income_3_type],
        monthly_income_3: []

      })
      const maritalIndex = this.maritalOptions.findIndex((resp: any) => resp.id == coApplicantPerosnalData.marital_status)
      this.selectedStatus = this.maritalOptions[maritalIndex].value
      this.selectedStatusId = coApplicantPerosnalData.marital_status

      this.setProvice(coApplicantAddressData.province);
      this.applicantInformationForm.controls['city'].setValue(
        coApplicantAddressData.city
      );
      this.setCity(coApplicantAddressData.city);
      this.applicantInformationForm.controls['parish'].setValue(
        coApplicantAddressData.parish
      );
      this.setParish(coApplicantAddressData.parish);

      const familyChargesIndex = this.NfcOptions.findIndex((resp: any) => resp.id == coApplicantPerosnalData.no_of_family_charges)
      this.selectedNfc = this.NfcOptions[familyChargesIndex].value
      this.selectedNfcId = coApplicantPerosnalData.no_of_family_charges

      const separationOfAssetsIndex = this.assetsOptions.findIndex((resp: any) => resp.id == coApplicantPerosnalData.is_separation_of_assets)
      this.selectedSOA = this.assetsOptions[separationOfAssetsIndex].value
      this.selectedSOAId = coApplicantPerosnalData.is_separation_of_assets


      const sexIndex = this.sexOptions.findIndex((resp: any) => resp.id == coApplicantPerosnalData.sex)
      this.selectedSex = this.sexOptions[sexIndex].value
      this.selectedSexId = coApplicantPerosnalData.sex

      const eductionLevelIndex = this.educationOptions.findIndex((resp: any) => resp.id == coApplicantPerosnalData.education_level)
      this.selectedEducation = this.educationOptions[eductionLevelIndex].value
      this.selectedEducationId = coApplicantPerosnalData.education_level

      const dependencyIndex = this.dependencyRelationships.findIndex((resp: any) => resp.id == coApplicantPerosnalData.dependency_relationship)
      this.selectedDependency = this.dependencyRelationships[dependencyIndex].value
      this.selectedDependencyId = coApplicantPerosnalData.dependency_relationship

      const nationalityIndex = this.nationalityOptions.findIndex((resp: any) => resp.val1 == coApplicantPerosnalData.is_foreigner)
      this.selectedNationality = this.nationalityOptions[nationalityIndex].value
      this.selectedNationalityId = coApplicantPerosnalData.is_foreigner

      const homeStatusIndex = this.homeSatusOptions.findIndex((resp: any) => resp.id == coApplicantAddressData.home_status)
      this.selectedHomeStatus = this.homeSatusOptions[homeStatusIndex].value
      this.selectedHomeStatusId = coApplicantAddressData.home_status

      const employmentTypeIndex = this.employmentTypeOptions.findIndex((resp: any) => resp.id == coApplicantEmploymentData.type)
      this.selectedEmploymentType = this.employmentTypeOptions[employmentTypeIndex].value
      this.selectedEmploymentTypeId = coApplicantEmploymentData.type

      this.selectedEconomicActivity = coApplicantEmploymentData.economic_activity
      this.sendAdditionalEconomicActivity = coApplicantEmploymentData.economic_activity

      if (coApplicantEmploymentData.additional_income_1_type) {
        this.selectedAdditionalEconomicActivity1 = coApplicantEmploymentData.additional_income_1_type
        this.sendAdditionalEconomicActivity1 = coApplicantEmploymentData.additional_income_1_type
        const additionalIncomeIndex = this.economicAdditionalActivityOptions1.findIndex((resp:any)=> resp.value == coApplicantEmploymentData.additional_income_1_type)
        this.selectedAdditionalEconomicActivityId1 = this.economicAdditionalActivityOptions1[additionalIncomeIndex].id
        this.filteredeconomicAdditionalActivityOptions2 = this.economicAdditionalActivityOptions2.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity1)
        this.filteredeconomicAdditionalActivityOptions3 = this.economicAdditionalActivityOptions3.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity1)
        // for(let i=0;i<this.economicAdditionalActivityOptions2.length;i++){
        //   if(this.economicAdditionalActivityOptions2[i].value == this.selectedAdditionalEconomicActivity1){
        //     this.economicAdditionalActivityOptions2.splice(i,1)
        //   }
        // }
        // for(let i=0;i<this.economicAdditionalActivityOptions3.length;i++){
        //   if(this.economicAdditionalActivityOptions3[i].value == this.selectedAdditionalEconomicActivity1){
        //     this.economicAdditionalActivityOptions3.splice(i,1)
        //   }
        // }
      }
      if (coApplicantEmploymentData.additional_income_2_type) {
        this.selectedAdditionalEconomicActivity2 = coApplicantEmploymentData.additional_income_2_type
        this.sendAdditionalEconomicActivity2 = coApplicantEmploymentData.additional_income_2_type
        const additionalIncomeIndex = this.economicAdditionalActivityOptions2.findIndex((resp:any)=> resp.value == coApplicantEmploymentData.additional_income_2_type)
        this.selectedAdditionalEconomicActivityId2 = this.economicAdditionalActivityOptions2[additionalIncomeIndex].id
        // for(let i=0;i<this.economicAdditionalActivityOptions3.length;i++){
        //   if(this.economicAdditionalActivityOptions3[i].value == this.selectedAdditionalEconomicActivity2){
        //     this.economicAdditionalActivityOptions3.splice(i,1)
        //   }
        // }
        // for(let i=0;i<this.economicAdditionalActivityOptions1.length;i++){
        //   if(this.economicAdditionalActivityOptions1[i].value == this.selectedAdditionalEconomicActivity2){
        //     this.economicAdditionalActivityOptions1.splice(i,1)
        //   }
        // }
        this.filteredeconomicAdditionalActivityOptions1 = this.filteredeconomicAdditionalActivityOptions1.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity2)
        this.filteredeconomicAdditionalActivityOptions3 = this.filteredeconomicAdditionalActivityOptions3.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity2)

      }
      if (coApplicantEmploymentData.additional_income_3_type) {
        this.selectedAdditionalEconomicActivity3 = coApplicantEmploymentData.additional_income_3_type
        this.sendAdditionalEconomicActivity3 = coApplicantEmploymentData.additional_income_3_type
        const additionalIncomeIndex = this.economicAdditionalActivityOptions3.findIndex((resp:any)=> resp.value == coApplicantEmploymentData.additional_income_3_type)
        this.selectedAdditionalEconomicActivityId3 = this.economicAdditionalActivityOptions3[additionalIncomeIndex].id
        // for(let i=0;i<this.economicAdditionalActivityOptions2.length;i++){
        //   if(this.economicAdditionalActivityOptions2[i].value == this.selectedAdditionalEconomicActivity3){
        //     this.economicAdditionalActivityOptions2.splice(i,1)
        //   }
        // }
        // for(let i=0;i<this.economicAdditionalActivityOptions1.length;i++){
        //   if(this.economicAdditionalActivityOptions1[i].value == this.selectedAdditionalEconomicActivity3){
        //     this.economicAdditionalActivityOptions1.splice(i,1)
        //   }
        // }
        this.filteredeconomicAdditionalActivityOptions1 = this.filteredeconomicAdditionalActivityOptions1.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity3)
        this.filteredeconomicAdditionalActivityOptions2 = this.filteredeconomicAdditionalActivityOptions2.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity3)
      }
      if (coApplicantEmploymentData.additional_income_1) {
        this.applicantInformationForm.controls['monthly_income_1'].setValue((coApplicantEmploymentData.additional_income_1).toLocaleString('es'))
      }
      if (coApplicantEmploymentData.additional_income_2) {
        this.applicantInformationForm.controls['monthly_income_2'].setValue((coApplicantEmploymentData.additional_income_2).toLocaleString('es'))
      }
      if (coApplicantEmploymentData.additional_income_3) {
        this.applicantInformationForm.controls['monthly_income_3'].setValue((coApplicantEmploymentData.additional_income_3).toLocaleString('es'))
      }


      if (this.selectedEmploymentTypeId == 'employed') {
        // const jobTitleIndex = this.jobTitleOptions.findIndex((resp: any) => resp.id == coApplicantEmploymentData.job_title)
        // this.selectedJobTitle = this.jobTitleOptions[jobTitleIndex].value
        // this.selectedJobTitleId = coApplicantEmploymentData.job_title

        const contractTypeIndex = this.typeOfContract.findIndex((resp: any) => resp.id == coApplicantEmploymentData.contract_type)
        this.selectedTypeOfContract = this.typeOfContract[contractTypeIndex].value
        this.selectedTypeOfContractId = coApplicantEmploymentData.contract_type

        this.applicantInformationForm.controls['start_date_job'].setValue(coApplicantEmploymentData.starting_date)
        this.applicantInformationForm.controls['position'].setValue(coApplicantEmploymentData.position)

      } else if (this.selectedEmploymentTypeId == 'self_employed') {
        const establishmentIndex = this.typeOfEstablishmentOptions.findIndex((resp: any) => resp.id1 == coApplicantEmploymentData.establishment_type)
        this.selectedTypeOfEstablishment = this.typeOfEstablishmentOptions[establishmentIndex].value
        this.selectedTypeOfEstablishmentId = coApplicantEmploymentData.establishment_type
        this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].setValue(coApplicantEmploymentData.document_value)

        const documentIndex = this.rucrimpeOptions.findIndex((resp: any) => resp.id == coApplicantEmploymentData.document_type)
        this.selectedrucrimpe = this.rucrimpeOptions[documentIndex].value
        this.selectedrucrimpeId = coApplicantEmploymentData.document_type

        this.applicantInformationForm.controls['position'].setValue(coApplicantEmploymentData.position)
        const companyMobileNumber = coApplicantEmploymentData.company_country_code + coApplicantEmploymentData.company_mobile_no
        this.applicantInformationForm.controls['company_phone_no'].setValue(companyMobileNumber)
      }

      const BusinessTypeIndex = this.typesOfBusinesses.findIndex((resp: any) => resp.id == coApplicantEmploymentData.business_type)
      this.selectedtypeOfBusiness = this.typesOfBusinesses[BusinessTypeIndex].value
      this.selectedtypeOfBusinessId = coApplicantEmploymentData.business_type

      const sizeOfCompanyIndex = this.sizeOfCompanyOptions.findIndex((resp: any) => resp.id == coApplicantEmploymentData.company_size)
      this.selectedSizeOfCompany = this.sizeOfCompanyOptions[sizeOfCompanyIndex].value
      this.selectedSizeOfCompanyId = coApplicantEmploymentData.company_size

      const businessActivityIndex = this.businessActivities.findIndex((resp: any) => resp.id == coApplicantEmploymentData.business_activities)
      this.selectedBusinessActivity = this.businessActivities[businessActivityIndex].value
      this.selectedBusinessActivityId = coApplicantEmploymentData.business_activities

    }

    else {
      this.applicantInformationForm = this.fb.group({
        cedula_id: ['', [Validators.required]],
        full_name: ['', Validators.required],
        dob: ['', Validators.required],
        marital_status: ['', Validators.required],
        separation_of_assets: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
        )]],
        sex: ['', [Validators.required]],
        education_level: ['', Validators.required],
        number_family_charges: ['', Validators.required],
        mobile_number: ['', Validators.required],
        dependent_relationship: ['', Validators.required],
        nationality: ['', Validators.required],
        address: ['', Validators.required],
        additional_address: [''],
        province: ['', Validators.required],
        city: ['', Validators.required],
        parish: ['', Validators.required],
        neighborhood: ['', Validators.required],
        zip_code: [''],
        home_status: ['', Validators.required],
        move_in_date: ['', Validators.required],
        employment_type: ['', Validators.required],
        type_of_business: ['', Validators.required],
        company_name: ['', Validators.required],
        // job_title: [''],
        start_date_job: [''],
        type_of_contract: [''],
        // dependent_relationship_employment: [''],
        size_of_company: ['', Validators.required],
        position: [''],
        business_activity: ['', Validators.required],
        place_of_work: ['', Validators.required],
        monthly_income: ['', [Validators.required,Validators.pattern('^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$')]],
        type_of_establishment: [''],
        select_ruc_rimpe: [''],
        number_of_your_ruc_rimpe: [''],
        economic_activity: ['', Validators.required],
        company_phone_no: [''],
        entry_date: [''],
        // retired_since: [''],
        economic_activity_income_1: [''],
        monthly_income_1: [''],
        economic_activity_income_2: [''],
        monthly_income_2: [''],
        economic_activity_income_3: [''],
        monthly_income_3: ['']
      })
    }

  }

  selectAccordian(accordian: string, i: number) {
    if (this.selectedAccordian != accordian) {
      this.selectedAccordian = accordian;
      if(accordian == 'personal_information'){
        // this.accordian1.nativeElement.scrollIntoView();
        window.scrollTo(0,0)
      }else if(accordian == 'address'){
        // this.accordian2.nativeElement.scrollIntoView();
        window.scrollTo(0,100)
      }else if(accordian == 'employment'){
        // this.accordian3.nativeElement.scrollIntoView();
        window.scrollTo(0,200)
      }else if(accordian == 'additional_income'){
        // this.accordian4.nativeElement.scrollIntoView();
        window.scrollTo(0,300)
      }
      this.isOpened = true;
    } else {
      this.isOpened = !this.isOpened;
      this.selectedAccordian = ''
    }
  }

  ngAfterViewInit(): void {
    this.addressOfApplicant();
    this.applicantPlaceOfWork();
  }

  private applicantPlaceOfWork() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.workPlace?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.fillInPlaceOfWork(place, true);
      });
    });
  }
  private addressOfApplicant() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.address?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.latitude = place.geometry['location'].lat();
        this.longitude = place.geometry['location'].lng();
        this.fillInAddress(place, true);
      });
    });
  }

  public fillInPlaceOfWork(place: any, isAddress: boolean = false) {

    try {
      //Reference Url:  https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      let address1 = "";
      let province = '';
      let city = '';
      let parish = '';
      let country = '';
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_address": {
            address1 += `${component.long_name}`;
            break;
          }
          case "point_of_interest": {
            address1 += `${component.long_name}`;
            break;
          }
          case "establishment": {
            address1 += `${component.long_name}`;
            break;
          }
          case "street_number": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "route": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "sublocality_level_3":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_2":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_1":
            parish = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['parish'].setValue(parish);
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['parish'].setValue(parish);
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['city'].setValue(city);
            }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "country":
            if (isAddress) {
              country = component.long_name;
            }
            break;
        }
      }
      if (parish != '') {
        address1 += ',' + parish;
      }
      if (city != '') {
        address1 += ',' + city;
      }
      if (province != '') {
        address1 += ',' + province;
      }
      if (country != '') {
        address1 += ',' + country;
      }
      isAddress ? this.applicantInformationForm.controls['place_of_work'].patchValue(address1) : this.applicantInformationForm.controls['place_of_work'].setValue(address1);
    } catch (ex) {
    }
  }

  public fillInAddress(place: any, isAddress: boolean = false) {
    try {
      //Reference Url:  https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      let address1 = "";
      let province = '';
      let city = '';
      let parish = '';
      let country = '';
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_address": {
            address1 += `${component.long_name}`;
            break;
          }
          case "point_of_interest": {
            address1 += `${component.long_name}`;
            break;
          }
          case "establishment": {
            address1 += `${component.long_name}`;
            break;
          }
          case "street_number": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "route": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "sublocality_level_3":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_2":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_1":
            parish = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['parish'].setValue(parish);
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['parish'].setValue(parish);
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['city'].setValue(city);
            }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              // this.applicantInformationForm.controls['province'].setValue(province);
            }
            break;
          case "country":
            if (isAddress) {
              country = component.long_name;
            }
            break;
        }
      }
      if (parish != '') {
        address1 += ',' + parish;
      }
      if (city != '') {
        address1 += ',' + city;
      }
      if (province != '') {
        address1 += ',' + province;
      }
      if (country != '') {
        address1 += ',' + country;
      }
      isAddress ? this.applicantInformationForm.controls['address'].patchValue(address1) : this.applicantInformationForm.controls['additional_address'].setValue(address1);
    } catch (ex) {
    }
  }

  selectValue(event: any, value: any, field: any, value1?: any) {
    if (field === 'marital') {
      this.selectedStatusId = event.target.id
      this.selectedStatus = value
    } else if (field === 'soa') {
      this.selectedSOAId = value1
      this.selectedSOA = value
      this.applicantInformationForm.controls['separation_of_assets'].setValue(this.selectedSOA)
    } else if (field === 'sex') {
      this.selectedSexId = event.target.id
      this.selectedSex = value
    } else if (field === 'education') {
      this.selectedEducationId = event.target.id
      this.selectedEducation = value
    } else if (field === 'nfc') {
      this.selectedNfcId = event.target.id
      this.selectedNfc = value
      this.applicantInformationForm.controls['number_family_charges'].setValue(this.selectedNfc)

    } else if (field === 'nationality') {
      this.selectedNationalityId = value1
      this.selectedNationality = value
      this.applicantInformationForm.controls['nationality'].setValue(this.selectedNationality)

    } else if (field === 'dependent_relationship') {
      this.selectedDependencyId = event.target.id
      this.selectedDependency = value;
    } else if (field === 'home_status') {
      this.selectedHomeStatusId = event.target.id
      this.selectedHomeStatus = value
    } else if (field === 'employment_type') {
      this.selectedEmploymentTypeId = event.target.id
      this.selectedEmploymentType = value

      if (this.selectedEmploymentTypeId === 'employed') {
        // this.applicantInformationForm.controls['job_title'].setValidators([Validators.required])
        // this.applicantInformationForm.controls['job_title'].updateValueAndValidity()
        this.applicantInformationForm.controls['start_date_job'].setValidators([Validators.required])
        this.applicantInformationForm.controls['start_date_job'].updateValueAndValidity()
        this.applicantInformationForm.controls['type_of_contract'].setValidators([Validators.required])
        this.applicantInformationForm.controls['type_of_contract'].updateValueAndValidity()
        this.applicantInformationForm.controls['position'].setValidators([Validators.required])
        this.applicantInformationForm.controls['position'].updateValueAndValidity()
        this.applicantInformationForm.controls['type_of_establishment'].clearValidators()
        this.applicantInformationForm.controls['type_of_establishment'].updateValueAndValidity()
        this.applicantInformationForm.controls['select_ruc_rimpe'].clearValidators()
        this.applicantInformationForm.controls['select_ruc_rimpe'].updateValueAndValidity()
        this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].clearValidators()
        this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].updateValueAndValidity()
        this.applicantInformationForm.controls['company_phone_no'].clearValidators()
        this.applicantInformationForm.controls['company_phone_no'].updateValueAndValidity()
        this.applicantInformationForm.controls['entry_date'].clearValidators()
        this.applicantInformationForm.controls['entry_date'].updateValueAndValidity()
        this.applicantInformationForm.controls['retired_since'].clearValidators()
        this.applicantInformationForm.controls['retired_since'].updateValueAndValidity()

      } else if (this.selectedEmploymentTypeId === 'self_employed') {
        // this.applicantInformationForm.controls['job_title'].clearValidators()
        // this.applicantInformationForm.controls['job_title'].updateValueAndValidity()
        this.applicantInformationForm.controls['start_date_job'].clearValidators()
        this.applicantInformationForm.controls['start_date_job'].updateValueAndValidity()
        this.applicantInformationForm.controls['type_of_contract'].clearValidators()
        this.applicantInformationForm.controls['type_of_contract'].updateValueAndValidity()
        this.applicantInformationForm.controls['position'].setValidators([Validators.required])
        this.applicantInformationForm.controls['position'].updateValueAndValidity()
        this.applicantInformationForm.controls['type_of_establishment'].setValidators([Validators.required])
        this.applicantInformationForm.controls['type_of_establishment'].updateValueAndValidity()
        this.applicantInformationForm.controls['select_ruc_rimpe'].setValidators([Validators.required])
        this.applicantInformationForm.controls['select_ruc_rimpe'].updateValueAndValidity()
        this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].setValidators([Validators.required])
        this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].updateValueAndValidity()
        this.applicantInformationForm.controls['company_phone_no'].setValidators([Validators.required])
        this.applicantInformationForm.controls['company_phone_no'].updateValueAndValidity()
        this.applicantInformationForm.controls['entry_date'].setValidators([Validators.required])
        this.applicantInformationForm.controls['entry_date'].updateValueAndValidity()
        this.applicantInformationForm.controls['retired_since'].clearValidators()
        this.applicantInformationForm.controls['retired_since'].updateValueAndValidity()

      }

      // else if (this.selectedEmploymentTypeId === 'retired') {
      //   this.applicantInformationForm.controls['job_title'].clearValidators()
      //   this.applicantInformationForm.controls['job_title'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['start_date_job'].clearValidators()
      //   this.applicantInformationForm.controls['start_date_job'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['type_of_contract'].clearValidators()
      //   this.applicantInformationForm.controls['type_of_contract'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['position'].clearValidators()
      //   this.applicantInformationForm.controls['position'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['type_of_establishment'].clearValidators()
      //   this.applicantInformationForm.controls['type_of_establishment'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['select_ruc_rimpe'].clearValidators()
      //   this.applicantInformationForm.controls['select_ruc_rimpe'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].clearValidators()
      //   this.applicantInformationForm.controls['number_of_your_ruc_rimpe'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['company_phone_no'].clearValidators()
      //   this.applicantInformationForm.controls['company_phone_no'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['entry_date'].clearValidators()
      //   this.applicantInformationForm.controls['entry_date'].updateValueAndValidity()
      //   this.applicantInformationForm.controls['retired_since'].setValidators([Validators.required])
      //   this.applicantInformationForm.controls['retired_since'].updateValueAndValidity()
      // }
    } else if (field === 'contract_type') {
      this.selectedTypeOfContractId = event.target.id
      this.selectedTypeOfContract = value
    } else if (field === 'type_of_business') {
      this.selectedtypeOfBusinessId = event.target.id
      this.selectedtypeOfBusiness = value
    } else if (field === 'size_of_company') {
      this.selectedSizeOfCompanyId = event.target.id
      this.selectedSizeOfCompany = value
    } else if (field === 'business_activity') {
      this.selectedBusinessActivityId = event.target.id
      this.selectedBusinessActivity = value
    }else if (field === 'type_establishment') {
      this.selectedTypeOfEstablishmentId = value1
      this.selectedTypeOfEstablishment = value
    } else if (field === 'economic_activity') {
      this.selectedEconomicActivityId = event.target.id
      this.selectedEconomicActivity = value1
      this.sendAdditionalEconomicActivity = value
      this.applicantInformationForm.controls['economic_activity'].setValue(this.sendAdditionalEconomicActivity)
    } else if (field === 'number_of_ruc_rise') {
      this.selectedrucrimpeId = event.target.id
      this.selectedrucrimpe = value
    }
  }

  ngAfterViewChecked(): void {
    const getElement: ElementRef | any = document.querySelector(`ngx-intl-tel-input .search-container input`);
    if (getElement && !getElement.getAttribute('autocomplete')) {
      this.render.setAttribute(getElement, 'autocomplete', 'none');
      this.render.setAttribute(getElement, 'type', 'search');
    }
  }


  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  sendApplicantInformation() {
    this.isSubmitted = true;
    if (this.applicantInformationForm.invalid) {
      const message = this.translate.instant("Please fill all the fields")
      this.toastr.warning(message)
    } else {
      if (!isValidCedulaId(this.applicantInformationForm.controls['cedula_id'].value)) {
        const message = this.translate.instant("Enter valid Cedula Id")
        this.toastr.error(message)
      } else {
        let postData: any = {
          personal_info: {},
          address_info: {},
          employment_info: {}
        }
        postData.cedula_id = this.applicantInformationForm.controls['cedula_id'].value
        postData.personal_info.full_name = this.applicantInformationForm.value.full_name
        postData.personal_info.dob = this.applicantInformationForm.value.dob
        postData.personal_info.marital_status = this.selectedStatusId
        postData.personal_info.is_separation_of_assets = this.selectedSOAId
        postData.personal_info.sex = this.selectedSexId
        postData.personal_info.education_level = this.selectedEducationId
        postData.personal_info.email = this.applicantInformationForm.value.email
        postData.personal_info.no_of_family_charges = this.selectedNfcId
        postData.personal_info.is_foreigner = this.selectedNationalityId
        postData.personal_info.country_code = this.applicantInformationForm.value.mobile_number.dialCode;
        postData.personal_info.mobile_no = this.applicantInformationForm.value.mobile_number.number.includes(postData.personal_info.country_code) ? this.applicantInformationForm.value.mobile_number.number.replace(postData.personal_info.country_code, "") : this.applicantInformationForm.value.mobile_number.number;
        postData.personal_info.mobile_no = postData.personal_info.mobile_no.replaceAll(/\s/g, '');
        postData.personal_info.dependency_relationship = this.selectedDependencyId



        postData.address_info.address = this.applicantInformationForm.value.address
        if (this.applicantInformationForm.value.additional_address) {
          postData.address_info.additional_address = this.applicantInformationForm.value.additional_address
        }
        postData.address_info.city = this.applicantInformationForm.value.city
        postData.address_info.parish = this.applicantInformationForm.value.parish
        postData.address_info.province = this.applicantInformationForm.value.province
        postData.address_info.neighborhood = this.applicantInformationForm.value.neighborhood
        if (this.applicantInformationForm.value.zip_code) {
          postData.address_info.zip_code = this.applicantInformationForm.value.zip_code
        }
        postData.address_info.home_status = this.applicantInformationForm.value.home_status
        postData.address_info.move_in_date = this.applicantInformationForm.value.move_in_date


        postData.employment_info.type = this.selectedEmploymentTypeId
        postData.employment_info.monthly_income =this.sendValueInNormalFormat('monthly_income')
        postData.employment_info.address = this.applicantInformationForm.value.place_of_work
        postData.employment_info.company_name = this.applicantInformationForm.value.company_name
        postData.employment_info.business_activities = this.selectedBusinessActivityId
        postData.employment_info.company_size = this.selectedSizeOfCompanyId
        postData.employment_info.business_type = this.selectedtypeOfBusinessId
        postData.employment_info.economic_activity = this.sendAdditionalEconomicActivity


        if (this.selectedAdditionalEconomicActivity1) {
          postData.employment_info.additional_income_1_type = this.sendAdditionalEconomicActivity1
          if (this.applicantInformationForm.value.monthly_income_1) {
            postData.employment_info.additional_income_1 = this.sendValueInNormalFormat('monthly_income_1')
          }
        }
        if (this.selectedAdditionalEconomicActivity2) {
          postData.employment_info.additional_income_2_type = this.sendAdditionalEconomicActivity2
          if (this.applicantInformationForm.value.monthly_income_2) {
            postData.employment_info.additional_income_2 = this.sendValueInNormalFormat('monthly_income_2')
          }
        }
        if (this.selectedAdditionalEconomicActivity3) {
          postData.employment_info.additional_income_3_type = this.sendAdditionalEconomicActivity3
          if (this.applicantInformationForm.value.monthly_income_3) {
            postData.employment_info.additional_income_3 = this.sendValueInNormalFormat('monthly_income_3')
          }
        }





        if (this.selectedEmploymentTypeId == 'employed') {
          // postData.employment_info.job_title = this.applicantInformationForm.value.job_title
          postData.employment_info.starting_date = this.applicantInformationForm.value.start_date_job
          postData.employment_info.position = this.applicantInformationForm.value.position
          postData.employment_info.contract_type = this.selectedTypeOfContractId
        } else if (this.selectedEmploymentTypeId == 'self_employed') {
          postData.employment_info.establishment_type = this.selectedTypeOfEstablishmentId
          postData.employment_info.document_type = this.selectedrucrimpeId
          postData.employment_info.document_value = this.applicantInformationForm.value.number_of_your_ruc_rimpe
          postData.employment_info.position = this.applicantInformationForm.value.position
          postData.employment_info.company_country_code = this.applicantInformationForm.value.company_phone_no.dialCode
          postData.employment_info.company_mobile_no = this.applicantInformationForm.value.company_phone_no.number.includes(postData.employment_info.company_country_code) ? this.applicantInformationForm.value.company_phone_no.number.replace(postData.employment_info.company_country_code, "") : this.applicantInformationForm.value.company_phone_no.number;
          postData.employment_info.company_mobile_no = postData.employment_info.company_mobile_no.replaceAll(/\s/g, '');
          postData.employment_info.entry_date = this.applicantInformationForm.value.entry_date
        }

        // else if (this.selectedEmploymentTypeId == 'retired') {
        //   postData.employment_info.retired_since = this.applicantInformationForm.value.retired_since
        // }

        let sendcoApplcantData: any = {
          current_stage: this.loanCurrentStage.CO_APPLICANT_INFO,
          co_applicant_info: postData,
          id: this.currentLoanId
        }
        this.loanProcedureService.patchLoanDetails(sendcoApplcantData).subscribe({
          next: (resp: any) => {
            this.currentLoanDetail.co_applicant_info = postData
            this.currentLoanDetail.current_stage = this.loanCurrentStage.REFERENCE_INFO
            this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.REFERENCE_INFO });

          },
          error: (errorRes: Error) => {
            const error = errorRes.error;
            if (error?.error?.length) {
              this.toastr.error(error.error[0]);
            } else {
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
            }
          }

        })

      }

    }



  }
  public get loanCurrentStage(): typeof LoanStages {
    return LoanStages;
  }

  setPreviousStep() {
    //this.scheduleMeetingData.current_stage = this.orderCurrentStage.SCHEDULE_MEETING;
    if (this.currentLoanDetail.applicant_info.is_co_applicant) {
      this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.APPLICANT_INFO });
    } else {
      this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.APPLICANT_INFO });

    }
  }

  formatNumber(event: any, field?: any) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replace(/,/g, '');
       value = parseFloat(value).toLocaleString('es');
      if (field == 'income_1') {
        this.applicantInformationForm.get('monthly_income_1')?.setValue(value);
      } else if (field == 'income_2') {
        this.applicantInformationForm.get('monthly_income_2')?.setValue(value);
      } else if (field == 'income_3') {
        this.applicantInformationForm.get('monthly_income_3')?.setValue(value);
      } else {
        this.applicantInformationForm.get('monthly_income')?.setValue(value);
      }
    }
  }
  formatToNumber(event: any, field?: string) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');

      if (field == 'income_1') {
        this.applicantInformationForm.get('monthly_income_1')?.setValue(value);
      } else if (field == 'income_2') {
        this.applicantInformationForm.get('monthly_income_2')?.setValue(value);
      } else if (field == 'income_3') {
        this.applicantInformationForm.get('monthly_income_3')?.setValue(value);
      } else {
        this.applicantInformationForm.get('monthly_income')?.setValue(value);
      }
    }
  }

  setProvice(province: string) {
    this.applicantInformationForm.controls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.applicantInformationForm.controls['city'].setValue('');
    this.applicantInformationForm.controls['parish'].setValue('');
    this.addAddressService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.applicantInformationForm.controls['city'].setValue(city);
    this.applicantInformationForm.controls['parish'].setValue('');
    this.searchCity = '';
    this.addAddressService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.applicantInformationForm.controls['parish'].setValue(parish);
    this.searchParish = '';
  }

  public sendValueInNormalFormat(fieldName:string){
    let normalNumber:any;
    if (this.applicantInformationForm.value[`${fieldName}`].toString().includes(',')) {
      normalNumber = (this.applicantInformationForm.value[`${fieldName}`]).replace(",", '')
      if (normalNumber.includes('.')) {
        normalNumber = ((normalNumber).replace(".", ''))
      } else {
        normalNumber = normalNumber
      }
    } else if (this.applicantInformationForm.value[`${fieldName}`].toString().includes('.')) {
      normalNumber = ((this.applicantInformationForm.value[`${fieldName}`]).toString().replace(".", ''))
      if (normalNumber.includes(',')) {
        normalNumber = ((normalNumber).replace(",", ''))
      } else {
        normalNumber = normalNumber
      }
    } else {
      normalNumber = this.applicantInformationForm.value[`${fieldName}`]
    }
    return normalNumber;
  }
  // selectAdditionalEcnomicActivity(event: any, value: any, field: any, value1?: any) {
  //   if (field === 'income_1') {
  //     this.selectedAdditionalEconomicActivityId1 = event.target.id
  //     this.selectedAdditionalEconomicActivity1 = value1
  //     this.sendAdditionalEconomicActivity1 = value

  //     for(let i=0;i<this.economicAdditionalActivityOptions2.length;i++){
  //       if(this.economicAdditionalActivityOptions2[i].value == this.selectedAdditionalEconomicActivity1){
  //         this.economicAdditionalActivityOptions2.splice(i,1)
  //       }
  //     }
  //     for(let i=0;i<this.economicAdditionalActivityOptions3.length;i++){
  //       if(this.economicAdditionalActivityOptions3[i].value == this.selectedAdditionalEconomicActivity1){
  //         this.economicAdditionalActivityOptions3.splice(i,1)
  //       }
  //     }
  //     this.applicantInformationForm.controls['economic_activity_income_1'].setValue(this.sendAdditionalEconomicActivity1)
  //     this.applicantInformationForm.controls['monthly_income_1'].setValidators([Validators.required])
  //     this.applicantInformationForm.controls['monthly_income_1'].updateValueAndValidity()
  //   } else if (field === 'income_2') {
  //     this.selectedAdditionalEconomicActivityId2 = event.target.id
  //     this.selectedAdditionalEconomicActivity2 = value1
  //     this.sendAdditionalEconomicActivity2 = value

  //     for(let i=0;i<this.economicAdditionalActivityOptions3.length;i++){
  //       if(this.economicAdditionalActivityOptions3[i].value == this.selectedAdditionalEconomicActivity2){
  //         this.economicAdditionalActivityOptions3.splice(i,1)
  //       }
  //     }

  //     for(let i=0;i<this.economicAdditionalActivityOptions1.length;i++){
  //       if(this.economicAdditionalActivityOptions1[i].value == this.selectedAdditionalEconomicActivity2){
  //         this.economicAdditionalActivityOptions1.splice(i,1)
  //       }
  //     }
  //     this.applicantInformationForm.controls['economic_activity_income_2'].setValue(this.sendAdditionalEconomicActivity2)
  //     this.applicantInformationForm.controls['monthly_income_2'].setValidators([Validators.required])
  //     this.applicantInformationForm.controls['monthly_income_2'].updateValueAndValidity()
  //   } else if (field === 'income_3') {
  //     this.selectedAdditionalEconomicActivityId3 = event.target.id
  //     this.selectedAdditionalEconomicActivity3 = value1
  //     this.sendAdditionalEconomicActivity3 = value

  //     for(let i=0;i<this.economicAdditionalActivityOptions2.length;i++){
  //       if(this.economicAdditionalActivityOptions2[i].value == this.selectedAdditionalEconomicActivity3){
  //         this.economicAdditionalActivityOptions2.splice(i,1)
  //       }
  //     }
  //     for(let i=0;i<this.economicAdditionalActivityOptions1.length;i++){
  //       if(this.economicAdditionalActivityOptions1[i].value == this.selectedAdditionalEconomicActivity3){
  //         this.economicAdditionalActivityOptions1.splice(i,1)
  //       }
  //     }
  //     this.applicantInformationForm.controls['economic_activity_income_3'].setValue(this.sendAdditionalEconomicActivity3)
  //     this.applicantInformationForm.controls['monthly_income_3'].setValidators([Validators.required])
  //     this.applicantInformationForm.controls['monthly_income_3'].updateValueAndValidity()
  //   }
  // }

  selectAdditionalEcnomicActivity(event: any, value: any, field: any, value1?: any) {
    if (field === 'income_1') {
      if(event.target.id == this.selectedAdditionalEconomicActivityId1){
        this.selectedAdditionalEconomicActivityId1 = null
        this.selectedAdditionalEconomicActivity1 = null
        this.sendAdditionalEconomicActivity1 = null
        let activityObject3:any
        let activityObject2:any
        for(let i=0; i<this.economicAdditionalActivityOptions3.length;i++){
          if(this.economicAdditionalActivityOptions3[i].value == value){
            activityObject3 = {
              id:this.economicAdditionalActivityOptions3[i].id,
              value:value1,
              ecoValue3:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions3.push(activityObject3)
        for(let i=0; i<this.economicAdditionalActivityOptions1.length;i++){
          if(this.economicAdditionalActivityOptions2[i].value == value){
            activityObject2 = {
              id:this.economicAdditionalActivityOptions2[i].id,
              value:value1,
              ecoValue2:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions2.push(activityObject2)
        this.selectedAdditionalEconomicActivityId2 = null
        this.selectedAdditionalEconomicActivity2 = null
        this.sendAdditionalEconomicActivity2 = null
        this.selectedAdditionalEconomicActivityId3 = null
        this.selectedAdditionalEconomicActivity3 = null
        this.sendAdditionalEconomicActivity3 = null
        this.applicantInformationForm.controls['monthly_income_2'].patchValue(null)
        this.applicantInformationForm.controls['monthly_income_3'].patchValue(null)
        this.applicantInformationForm.controls['economic_activity_income_1'].patchValue(null)
        this.applicantInformationForm.controls['monthly_income_1'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_1'].updateValueAndValidity()
        this.applicantInformationForm.controls['monthly_income_2'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_2'].updateValueAndValidity()
        this.applicantInformationForm.controls['monthly_income_3'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_3'].updateValueAndValidity()
    }else{
        this.selectedAdditionalEconomicActivityId1 = event.target.id
        this.selectedAdditionalEconomicActivity1 = value1
        this.sendAdditionalEconomicActivity1 = value
        this.filteredeconomicAdditionalActivityOptions2 = this.economicAdditionalActivityOptions2.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity1)
        this.filteredeconomicAdditionalActivityOptions3 = this.economicAdditionalActivityOptions3.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity1)
        this.applicantInformationForm.controls['economic_activity_income_1'].setValue(this.sendAdditionalEconomicActivity1)
        this.applicantInformationForm.controls['monthly_income_1'].setValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_1'].updateValueAndValidity()
        this.selectedAdditionalEconomicActivityId2 = null
        this.selectedAdditionalEconomicActivity2 = null
        this.sendAdditionalEconomicActivity2 = null
        this.selectedAdditionalEconomicActivityId3 = null
        this.selectedAdditionalEconomicActivity3 = null
        this.sendAdditionalEconomicActivity3 = null
      }

    } else if (field === 'income_2') {
      if(event.target.id == this.selectedAdditionalEconomicActivityId2){
        this.selectedAdditionalEconomicActivityId2 = null
        this.selectedAdditionalEconomicActivity2 = null
        this.sendAdditionalEconomicActivity2 = null
        let activityObject1:any
        let activityObject3:any
        for(let i=0; i<this.economicAdditionalActivityOptions1.length;i++){
          if(this.economicAdditionalActivityOptions1[i].value == value){
            activityObject1 = {
              id:this.economicAdditionalActivityOptions1[i].id,
              value:value1,
              ecoValue1:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions1.push(activityObject1)
        for(let i=0; i<this.economicAdditionalActivityOptions3.length;i++){
          if(this.economicAdditionalActivityOptions3[i].value == value){
            activityObject3 = {
              id:this.economicAdditionalActivityOptions3[i].id,
              value:value1,
              ecoValue3:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions3.push(activityObject3)
        this.selectedAdditionalEconomicActivityId3 = null
        this.selectedAdditionalEconomicActivity3 = null
        this.sendAdditionalEconomicActivity3 = null
        this.applicantInformationForm.controls['monthly_income_3'].patchValue(null)
        this.applicantInformationForm.controls['economic_activity_income_2'].patchValue(null)
        this.applicantInformationForm.controls['monthly_income_2'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_2'].updateValueAndValidity()
        this.applicantInformationForm.controls['monthly_income_3'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_3'].updateValueAndValidity()
      }else{
        this.selectedAdditionalEconomicActivityId2 = event.target.id
        this.selectedAdditionalEconomicActivity2 = value1
        this.sendAdditionalEconomicActivity2 = value
        this.filteredeconomicAdditionalActivityOptions3 = this.economicAdditionalActivityOptions3.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity2)
        this.filteredeconomicAdditionalActivityOptions1 = this.economicAdditionalActivityOptions1.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity2)
        this.applicantInformationForm.controls['economic_activity_income_2'].setValue(this.sendAdditionalEconomicActivity2)
        this.applicantInformationForm.controls['monthly_income_2'].setValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_2'].updateValueAndValidity()
        this.selectedAdditionalEconomicActivityId3 = null
        this.selectedAdditionalEconomicActivity3 = null
        this.sendAdditionalEconomicActivity3 = null
      }

    } else if (field === 'income_3') {
      if(event.target.id == this.selectedAdditionalEconomicActivityId3){
        this.selectedAdditionalEconomicActivityId3 = null
        this.selectedAdditionalEconomicActivity3 = null
        this.sendAdditionalEconomicActivity3 = null
        let activityObject1:any
        let activityObject2:any
        for(let i=0; i<this.economicAdditionalActivityOptions1.length;i++){
          if(this.economicAdditionalActivityOptions1[i].value == value){
            activityObject1 = {
              id:this.economicAdditionalActivityOptions1[i].id,
              value:value1,
              ecoValue1:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions1.push(activityObject1)
        for(let i=0; i<this.economicAdditionalActivityOptions1.length;i++){
          if(this.economicAdditionalActivityOptions2[i].value == value){
            activityObject2 = {
              id:this.economicAdditionalActivityOptions2[i].id,
              value:value1,
              ecoValue2:value
            }
          }
        }
        this.filteredeconomicAdditionalActivityOptions2.push(activityObject2)
        this.applicantInformationForm.controls['economic_activity_income_3'].patchValue(null)
        this.applicantInformationForm.controls['monthly_income_3'].removeValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_3'].updateValueAndValidity()
      }else{
        this.selectedAdditionalEconomicActivityId3 = event.target.id
        this.selectedAdditionalEconomicActivity3 = value1
        this.sendAdditionalEconomicActivity3 = value

        this.filteredeconomicAdditionalActivityOptions2 = this.economicAdditionalActivityOptions2.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity3)
        this.filteredeconomicAdditionalActivityOptions1 = this.economicAdditionalActivityOptions1.filter((option:any)=>option.value != this.selectedAdditionalEconomicActivity3)
        this.applicantInformationForm.controls['economic_activity_income_3'].setValue(this.sendAdditionalEconomicActivity3)
        this.applicantInformationForm.controls['monthly_income_3'].setValidators([Validators.required])
        this.applicantInformationForm.controls['monthly_income_3'].updateValueAndValidity()
      }

    }
  }
}
