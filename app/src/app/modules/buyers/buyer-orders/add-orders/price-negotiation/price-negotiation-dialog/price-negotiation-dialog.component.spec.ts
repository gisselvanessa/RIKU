import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceNegotiationDialogComponent } from './price-negotiation-dialog.component';

describe('PriceNegotiationDialogComponent', () => {
  let component: PriceNegotiationDialogComponent;
  let fixture: ComponentFixture<PriceNegotiationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceNegotiationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceNegotiationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
