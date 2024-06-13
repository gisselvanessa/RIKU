import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForDocComponent } from './request-for-doc.component';

describe('RequestForDocComponent', () => {
  let component: RequestForDocComponent;
  let fixture: ComponentFixture<RequestForDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
