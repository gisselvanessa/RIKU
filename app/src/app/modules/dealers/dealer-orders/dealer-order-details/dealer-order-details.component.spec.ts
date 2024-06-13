import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerOrderDetailsComponent } from './dealer-order-details.component';

describe('DealerOrderDetailsComponent', () => {
  let component: DealerOrderDetailsComponent;
  let fixture: ComponentFixture<DealerOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
