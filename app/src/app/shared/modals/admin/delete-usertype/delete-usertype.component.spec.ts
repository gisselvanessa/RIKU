import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUsertypeComponent } from './delete-usertype.component';

describe('DeleteUsertypeComponent', () => {
  let component: DeleteUsertypeComponent;
  let fixture: ComponentFixture<DeleteUsertypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUsertypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUsertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
