import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSubscribeDialogComponent } from './confirm-subscribe-dialog.component';

describe('ConfirmSubscribeDialogComponent', () => {
  let component: ConfirmSubscribeDialogComponent;
  let fixture: ComponentFixture<ConfirmSubscribeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSubscribeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSubscribeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
