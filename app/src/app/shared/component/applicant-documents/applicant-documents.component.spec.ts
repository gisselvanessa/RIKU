import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDocumentsComponent } from './applicant-documents.component';

describe('ApplicantDocumentsComponent', () => {
  let component: ApplicantDocumentsComponent;
  let fixture: ComponentFixture<ApplicantDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
