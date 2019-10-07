import { VisibleDirective } from './visible.directive';
import { inject } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

describe('VisibleDirective', () => {
  it('should create an instance', inject([ElementRef], (el: ElementRef) => {
    const directive = new VisibleDirective(el);
    expect(directive).toBeTruthy();
  }));
});
