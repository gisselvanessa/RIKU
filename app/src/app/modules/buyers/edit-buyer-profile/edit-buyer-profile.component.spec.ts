import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuyerProfileComponent } from './edit-buyer-profile.component';

describe('EditBuyerProfileComponent', () => {
  let component: EditBuyerProfileComponent;
  let fixture: ComponentFixture<EditBuyerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBuyerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
