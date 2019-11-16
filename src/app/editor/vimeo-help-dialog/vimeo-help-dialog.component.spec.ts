import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VimeoHelpDialogComponent } from './vimeo-help-dialog.component';

describe('VimeoHelpDialogComponent', () => {
  let component: VimeoHelpDialogComponent;
  let fixture: ComponentFixture<VimeoHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VimeoHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VimeoHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
