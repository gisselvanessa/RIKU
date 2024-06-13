import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerFormNewComponent } from './dealer-form-new.component';

describe('DealerFormNewComponent', () => {
  let component: DealerFormNewComponent;
  let fixture: ComponentFixture<DealerFormNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerFormNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerFormNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
