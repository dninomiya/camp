import { TestBed, async, inject } from '@angular/core/testing';

import { LessonEditorGuard } from './lesson-editor.guard';

describe('LessonEditorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonEditorGuard]
    });
  });

  it('should ...', inject([LessonEditorGuard], (guard: LessonEditorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
