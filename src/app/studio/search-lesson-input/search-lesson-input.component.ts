import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectSearchBox } from 'instantsearch.js/es/connectors';

@Component({
  selector: 'app-search-lesson-input',
  templateUrl: './search-lesson-input.component.html',
  styleUrls: ['./search-lesson-input.component.scss']
})
export class SearchLessonInputComponent extends BaseWidget implements OnInit {

  public state: {
    query: string;
    refine: any;
    clear: any;
    isSearchStalled: boolean;
    widgetParams: object;
 };

 constructor(
   @Inject(forwardRef(() => NgAisInstantSearch))
   public instantSearchParent
 ) {
   super('SearchBox');
 }

 ngOnInit() {
   this.createWidget(connectSearchBox, {});
   super.ngOnInit();
 }

}
