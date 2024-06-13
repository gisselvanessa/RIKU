import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertReviewListComponent } from './expert-review-list.component';

describe('ExpertReviewListComponent', () => {
  let component: ExpertReviewListComponent;
  let fixture: ComponentFixture<ExpertReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertReviewListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
