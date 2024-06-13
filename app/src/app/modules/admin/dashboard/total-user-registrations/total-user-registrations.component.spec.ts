import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalUserRegistrationsComponent } from './total-user-registrations.component';

describe('TotalUserRegistrationsComponent', () => {
  let component: TotalUserRegistrationsComponent;
  let fixture: ComponentFixture<TotalUserRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalUserRegistrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalUserRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
