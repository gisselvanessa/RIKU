import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalReferenceComponent } from './personal-reference.component';

describe('PersonalReferenceComponent', () => {
  let component: PersonalReferenceComponent;
  let fixture: ComponentFixture<PersonalReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
