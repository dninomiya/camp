import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLessonInputComponent } from './search-lesson-input.component';

describe('SearchLessonInputComponent', () => {
  let component: SearchLessonInputComponent;
  let fixture: ComponentFixture<SearchLessonInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLessonInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLessonInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
