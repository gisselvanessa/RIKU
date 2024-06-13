import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelExpertReviewDetailsDialogComponent } from './cancel-expert-review-details-dialog.component';

describe('CancelExpertReviewDetailsDialogComponent', () => {
  let component: CancelExpertReviewDetailsDialogComponent;
  let fixture: ComponentFixture<CancelExpertReviewDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelExpertReviewDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelExpertReviewDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
