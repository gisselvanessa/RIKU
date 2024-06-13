import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertReviewDetailsComponent } from './expert-review-details.component';

describe('ExpertReviewDetailsComponent', () => {
  let component: ExpertReviewDetailsComponent;
  let fixture: ComponentFixture<ExpertReviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertReviewDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
