import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApplicantDocumentsComponent } from './applicant-documents.component';

describe('AdminAdminAdminApplicantDocumentsComponent', () => {
  let component: AdminApplicantDocumentsComponent;
  let fixture: ComponentFixture<AdminApplicantDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminApplicantDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminApplicantDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
