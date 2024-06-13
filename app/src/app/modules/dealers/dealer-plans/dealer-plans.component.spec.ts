import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPlansComponent } from './dealer-plans.component';

describe('DealerPlansComponent', () => {
  let component: DealerPlansComponent;
  let fixture: ComponentFixture<DealerPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerPlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
