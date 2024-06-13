import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AccordianName } from '../../../report.mode';
@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss'],
  providers: [DatePipe]
})
export class MyDetailsComponent implements OnInit {

  @Input() isSave = false;
  @Input() statusOfReview: string;
  @Input() appraisallDetails: any = {};
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  @Input() selectAccordian: string;
  @Output() selectedAccordian: EventEmitter<any> = new EventEmitter();
  @Input() stepsCompleted: any;


  isFormSubmitted = false;
  myDetailsForm: FormGroup;
  myDetailsFormControls: any;
  accordianName = AccordianName;
  accordianOpen = false;

  toOptions = [{ id: 'buy', value: 'Buy' }, { id: 'sell', value: 'Sell' }, { id: 'loan', value: 'Loan' }]
  selectedTo: any;
  selectedToId: any;

  zoneOptions = [{ id: 'mountain_range', value: 'Mountain Range' }, { id: 'coast', value: 'Coast' }, { id: 'east', value: 'East' }]
  selectedZone: any;
  selectedZoneId: any;
  minDate = new Date();
  constructor(private fb: FormBuilder,private translate:TranslateService, private datePipe: DatePipe) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }


  ngOnInit(): void {
    this.detailsForm()
  }

  detailsForm() {
    if (this.appraisallDetails != null) {
      this.myDetailsForm = this.fb.group({
        expert_name: [this.appraisallDetails.expert_name, Validators.required],
        code_number: [this.appraisallDetails.code_number, Validators.required],
        appraisal_date: [new Date(this.appraisallDetails.appraisal_date), Validators.required],
        to: [this.appraisallDetails.to, Validators.required],
        zone: [this.appraisallDetails.zone, Validators.required],
        current_step: ['MY_DETAILS'],
      });
      this.selectedTo = this.appraisallDetails.to
      this.selectedZone = this.appraisallDetails.zone
    } else if (this.appraisallDetails == null) {
      const name = localStorage.getItem('expert_name');
      const code = localStorage.getItem('expert_code');
      this.myDetailsForm = this.fb.group({
        expert_name: [name, Validators.required],
        code_number: [code, Validators.required],
        appraisal_date: ['', Validators.required],
        to: ['', Validators.required],
        zone: ['', Validators.required],
        current_step: ['MY_DETAILS'],
      });
    }
    this.myDetailsFormControls = this.myDetailsForm.controls;
  }



  save() {
    //this.isSave = true;
    this.isFormSubmitted = true;
    // const date = this.datePipe.transform(this.myDetailsForm.value.appraisal_date, 'dd/MM/YYYY');
    // this.myDetailsForm.controls['appraisal_date'].patchValue(date)
    // console.log(this.myDetailsForm.value.appraisal_date)
    // this.myDetailsForm.markAllAsTouched();
    if (this.myDetailsForm.invalid) return;
    this.saveData.emit(this.myDetailsForm.value);
  }

  selectValue(event: any, value: any, field: any) {
    if (field === 'to') {
      this.selectedToId = event.target.value
      this.selectedTo = value
    } else if (field === 'zone') {
      this.selectedZoneId = event.target.value
      this.selectedZone = value
    }
  }

  selectedAccordians() {
    this.accordianOpen = !this.accordianOpen;
    const accordianName = this.accordianOpen ? this.accordianName.MyDetails : null;
    this.selectedAccordian.emit(accordianName)
  }
}
