import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDealerProfileComponent } from './edit-dealer-profile.component';

describe('EditDealerProfileComponent', () => {
  let component: EditDealerProfileComponent;
  let fixture: ComponentFixture<EditDealerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDealerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDealerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
