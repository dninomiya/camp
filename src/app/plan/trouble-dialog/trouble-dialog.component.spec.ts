import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleDialogComponent } from './trouble-dialog.component';

describe('TroubleDialogComponent', () => {
  let component: TroubleDialogComponent;
  let fixture: ComponentFixture<TroubleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
