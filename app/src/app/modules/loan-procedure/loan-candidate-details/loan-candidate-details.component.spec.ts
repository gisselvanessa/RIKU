import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCandidateDetailsComponent } from './loan-candidate-details.component';

describe('LoanCandidateDetailsComponent', () => {
  let component: LoanCandidateDetailsComponent;
  let fixture: ComponentFixture<LoanCandidateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanCandidateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanCandidateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
