import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WideLessonItemComponent } from './wide-lesson-item.component';

describe('WideLessonItemComponent', () => {
  let component: WideLessonItemComponent;
  let fixture: ComponentFixture<WideLessonItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WideLessonItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WideLessonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
