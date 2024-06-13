import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceNegotiationComponent } from './price-negotiation.component';

describe('PriceNegotiationComponent', () => {
  let component: PriceNegotiationComponent;
  let fixture: ComponentFixture<PriceNegotiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceNegotiationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
