import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBuyerProfileComponent } from './view-buyer-profile.component';

describe('ViewBuyerProfileComponent', () => {
  let component: ViewBuyerProfileComponent;
  let fixture: ComponentFixture<ViewBuyerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBuyerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
