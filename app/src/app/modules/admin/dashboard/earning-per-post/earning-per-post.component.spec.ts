import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningPerPostComponent } from './earning-per-post.component';

describe('EarningPerPostComponent', () => {
  let component: EarningPerPostComponent;
  let fixture: ComponentFixture<EarningPerPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningPerPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningPerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
