import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerChatComponent } from './dealer-chat.component';

describe('DealerChatComponent', () => {
  let component: DealerChatComponent;
  let fixture: ComponentFixture<DealerChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
