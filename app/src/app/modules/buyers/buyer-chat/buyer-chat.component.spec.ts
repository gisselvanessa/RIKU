import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerChatComponent } from './buyer-chat.component';

describe('BuyerChatComponent', () => {
  let component: BuyerChatComponent;
  let fixture: ComponentFixture<BuyerChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
