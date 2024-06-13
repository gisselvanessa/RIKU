import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateExpertComponent } from './add-update-expert.component';

describe('AddUpdateExpertComponent', () => {
  let component: AddUpdateExpertComponent;
  let fixture: ComponentFixture<AddUpdateExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateExpertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
