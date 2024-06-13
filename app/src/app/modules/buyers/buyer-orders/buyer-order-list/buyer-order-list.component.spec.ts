import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOrderListComponent } from './buyer-order-list.component';

describe('BuyerOrderListComponent', () => {
  let component: BuyerOrderListComponent;
  let fixture: ComponentFixture<BuyerOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
