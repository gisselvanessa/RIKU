import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[AlphaNumericWithoutSpace]'
})
export class AlphaNumericWithoutSpace {
   // Allow Only Alphabets and after space
   // private regex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/g);

   private regex: RegExp = new RegExp(/^[A-Za-z0-9_]*[A-Za-z0-9][A-Za-z0-9_]*$/);
   // Allow key codes for special events. Reflect :
   // Backspace, tab, end, home
   private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete','Space'];
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
