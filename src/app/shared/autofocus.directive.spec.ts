import { AutofocusDirective } from './autofocus.directive';
import { inject } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

describe('AutofocusDirective', () => {
  it('should create an instance', inject([ElementRef], (el: ElementRef) => {
    const directive = new AutofocusDirective(el);
    expect(directive).toBeTruthy();
  }));
});
