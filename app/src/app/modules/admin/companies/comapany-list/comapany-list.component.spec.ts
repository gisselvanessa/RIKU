import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComapanyListComponent } from './comapany-list.component';

describe('ComapanyListComponent', () => {
  let component: ComapanyListComponent;
  let fixture: ComponentFixture<ComapanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComapanyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComapanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
