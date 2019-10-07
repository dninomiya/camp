import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[appVisible]'
})
export class VisibleDirective implements AfterViewInit, OnDestroy {
  @Output() public visible: EventEmitter<any> = new EventEmitter();

  private intersectionObserver?: IntersectionObserver;

  constructor(private element: ElementRef) {}

  public ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.checkForIntersection(entries);
    }, {});
    this.intersectionObserver.observe(this.element.nativeElement);
  }

  private checkForIntersection = (
    entries: Array<IntersectionObserverEntry>
  ) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const isIntersecting =
        entry.isIntersecting && entry.target === this.element.nativeElement;

      if (isIntersecting) {
        this.visible.emit();
      }
    });
  }

  public ngOnDestroy() {
    this.intersectionObserver.disconnect();
  }
}
