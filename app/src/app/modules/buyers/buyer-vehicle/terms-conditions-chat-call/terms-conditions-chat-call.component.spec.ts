import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsChatCallComponent } from './terms-conditions-chat-call.component';

describe('TermsConditionsChatCallComponent', () => {
  let component: TermsConditionsChatCallComponent;
  let fixture: ComponentFixture<TermsConditionsChatCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsConditionsChatCallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsConditionsChatCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
