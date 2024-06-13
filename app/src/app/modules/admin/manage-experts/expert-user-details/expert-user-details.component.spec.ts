import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertUserDetailsComponent } from './expert-user-details.component';

describe('ExpertUserDetailsComponent', () => {
  let component: ExpertUserDetailsComponent;
  let fixture: ComponentFixture<ExpertUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
