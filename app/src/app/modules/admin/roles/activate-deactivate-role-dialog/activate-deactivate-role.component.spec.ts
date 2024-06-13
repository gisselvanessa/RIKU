import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateDeactivateRoleComponent } from './activate-deactivate-role.component';

describe('ActivateDeactivateRoleComponent', () => {
  let component: ActivateDeactivateRoleComponent;
  let fixture: ComponentFixture<ActivateDeactivateRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateDeactivateRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateDeactivateRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
