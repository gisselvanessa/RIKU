import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerFormItemComponent } from './dealer-form-item.component';

describe('DealerFormItemComponent', () => {
  let component: DealerFormItemComponent;
  let fixture: ComponentFixture<DealerFormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerFormItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
