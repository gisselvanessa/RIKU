import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfirmationComponent } from './edit-confirmation.component';

describe('EditConfirmationComponent', () => {
  let component: EditConfirmationComponent;
  let fixture: ComponentFixture<EditConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
