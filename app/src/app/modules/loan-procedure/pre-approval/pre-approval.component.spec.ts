import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreApprovalComponent } from './pre-approval.component';

describe('PreApprovalComponent', () => {
  let component: PreApprovalComponent;
  let fixture: ComponentFixture<PreApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
