import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerChatComponent } from './seller-chat.component';

describe('SellerChatComponent', () => {
  let component: SellerChatComponent;
  let fixture: ComponentFixture<SellerChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
