import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss']
})
export class AdditionalDetailsComponent implements OnInit {

  @Input() page: string;
  constructor() { }

  ngOnInit(): void {
  }

}
