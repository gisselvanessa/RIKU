import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.scss'],
  encapsulation:ViewEncapsulation.ShadowDom
})
export class CmsPageComponent implements OnInit {

  @Input() policyData:any;

  constructor() { }

  ngOnInit(): void {
  }

}