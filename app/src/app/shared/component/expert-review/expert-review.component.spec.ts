import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertReviewComponent } from './expert-review.component';

describe('ExpertReviewComponent', () => {
  let component: ExpertReviewComponent;
  let fixture: ComponentFixture<ExpertReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
