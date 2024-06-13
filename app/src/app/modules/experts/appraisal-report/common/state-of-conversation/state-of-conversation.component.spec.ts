import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateOfConversationComponent } from './state-of-conversation.component';

describe('StateOfConversationComponent', () => {
  let component: StateOfConversationComponent;
  let fixture: ComponentFixture<StateOfConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateOfConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateOfConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
