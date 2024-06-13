import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerOrderListComponent } from './dealer-order-list.component';

describe('DealerOrderListComponent', () => {
  let component: DealerOrderListComponent;
  let fixture: ComponentFixture<DealerOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
