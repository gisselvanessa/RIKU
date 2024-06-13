import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import Swiper core and required modules
import SwiperCore, { Zoom, Navigation, Pagination } from "swiper";


// install Swiper modules
SwiperCore.use([Zoom, Navigation, Pagination]);

@Component({
  selector: 'app-swiper-gallery',
  templateUrl: './swiper-gallery.component.html',
  styleUrls: ['./swiper-gallery.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SwiperGalleryComponent implements OnInit {
  @Input() public swiperImages: any;
  @Input() public index: any = 0;
  thumbsSwiper: any;
  constructor( public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }
}
