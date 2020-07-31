import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDialogComponent } from './point-dialog.component';

describe('PointDialogComponent', () => {
  let component: PointDialogComponent;
  let fixture: ComponentFixture<PointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
