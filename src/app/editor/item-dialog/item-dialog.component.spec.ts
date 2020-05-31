import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicDialogComponent } from './item-dialog.component';

describe('AtomicDialogComponent', () => {
  let component: AtomicDialogComponent;
  let fixture: ComponentFixture<AtomicDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtomicDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
