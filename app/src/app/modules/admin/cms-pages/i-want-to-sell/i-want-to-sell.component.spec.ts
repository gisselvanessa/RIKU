import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IWantToSellComponent } from './i-want-to-sell.component';

describe('IWantToSellComponent', () => {
  let component: IWantToSellComponent;
  let fixture: ComponentFixture<IWantToSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IWantToSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IWantToSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
