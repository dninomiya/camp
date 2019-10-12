import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VimeoDialogComponent } from './vimeo-dialog.component';

describe('VimeoDialogComponent', () => {
  let component: VimeoDialogComponent;
  let fixture: ComponentFixture<VimeoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VimeoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VimeoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
