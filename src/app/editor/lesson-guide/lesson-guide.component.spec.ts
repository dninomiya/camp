import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonGuideComponent } from './lesson-guide.component';

describe('LessonGuideComponent', () => {
  let component: LessonGuideComponent;
  let fixture: ComponentFixture<LessonGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
