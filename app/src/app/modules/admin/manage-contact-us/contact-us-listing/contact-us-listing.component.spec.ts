import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsListingComponent } from './contact-us-listing.component';

describe('ContactUsListingComponent', () => {
  let component: ContactUsListingComponent;
  let fixture: ComponentFixture<ContactUsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
