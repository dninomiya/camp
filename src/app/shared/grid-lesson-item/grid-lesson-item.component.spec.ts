import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLessonItemComponent } from './grid-lesson-item.component';

describe('GridLessonItemComponent', () => {
  let component: GridLessonItemComponent;
  let fixture: ComponentFixture<GridLessonItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLessonItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLessonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
