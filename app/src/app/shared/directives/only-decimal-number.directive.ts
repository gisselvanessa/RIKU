import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[OnlyDecimalNumber]'
})
export class OnlyDecimalNumber {
  // Allow decimal numbers
  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);

  // private regex: RegExp = new RegExp(/^[1-9]\d*(\.\d+)?$/g);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  //private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}

