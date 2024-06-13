import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sellers-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() price: string = '';
  @Input() characteristics: any[] = [];
  @Input() bgColor: string = '';
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.name)
  }

}
