import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeBuyerSellerComponent } from './become-buyer-seller.component';

describe('BecomeBuyerSellerComponent', () => {
  let component: BecomeBuyerSellerComponent;
  let fixture: ComponentFixture<BecomeBuyerSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeBuyerSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeBuyerSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
