import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagEditorDialogComponent } from './tag-editor-dialog.component';

describe('TagEditorDialogComponent', () => {
  let component: TagEditorDialogComponent;
  let fixture: ComponentFixture<TagEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
