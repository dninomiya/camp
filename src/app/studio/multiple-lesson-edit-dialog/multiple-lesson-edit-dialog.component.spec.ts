import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleLessonEditDialogComponent } from './multiple-lesson-edit-dialog.component';

describe('MultipleLessonEditDialogComponent', () => {
  let component: MultipleLessonEditDialogComponent;
  let fixture: ComponentFixture<MultipleLessonEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleLessonEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleLessonEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
