import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSellerProfileComponent } from './edit-seller-profile.component';

describe('EditSellerProfileComponent', () => {
  let component: EditSellerProfileComponent;
  let fixture: ComponentFixture<EditSellerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSellerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSellerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
