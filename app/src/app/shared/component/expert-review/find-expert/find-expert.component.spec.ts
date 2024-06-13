import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindExpertComponent } from './find-expert.component';

describe('FindExpertComponent', () => {
  let component: FindExpertComponent;
  let fixture: ComponentFixture<FindExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindExpertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
