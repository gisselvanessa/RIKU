import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberDetailsComponent } from './team-member-details.component';

describe('TeamMemberDetailsComponent', () => {
  let component: TeamMemberDetailsComponent;
  let fixture: ComponentFixture<TeamMemberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
