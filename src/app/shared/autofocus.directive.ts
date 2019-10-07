import { Directive, OnInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {

  @Input() appAutofocus: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.appAutofocus) {
      this.el.nativeElement.focus();
    }
  }
}
