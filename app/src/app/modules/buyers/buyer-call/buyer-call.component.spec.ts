import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerCallComponent } from './buyer-call.component';

describe('BuyerCallComponent', () => {
  let component: BuyerCallComponent;
  let fixture: ComponentFixture<BuyerCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerCallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
