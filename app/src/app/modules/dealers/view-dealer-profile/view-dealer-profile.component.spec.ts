import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealerProfileComponent } from './view-dealer-profile.component';

describe('ViewDealerProfileComponent', () => {
  let component: ViewDealerProfileComponent;
  let fixture: ComponentFixture<ViewDealerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDealerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
