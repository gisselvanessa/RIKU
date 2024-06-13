import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoanDetailsComponent } from './view-loan-details.component';

describe('ViewLoanDetailsComponent', () => {
  let component: ViewLoanDetailsComponent;
  let fixture: ComponentFixture<ViewLoanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLoanDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
