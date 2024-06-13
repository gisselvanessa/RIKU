import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperGalleryComponent } from './swiper-gallery.component';

describe('SwiperGalleryComponent', () => {
  let component: SwiperGalleryComponent;
  let fixture: ComponentFixture<SwiperGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
