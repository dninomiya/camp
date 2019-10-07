import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUnsubscribeDialogComponent } from './confirm-unsubscribe-dialog.component';

describe('ConfirmUnsubscribeDialogComponent', () => {
  let component: ConfirmUnsubscribeDialogComponent;
  let fixture: ComponentFixture<ConfirmUnsubscribeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUnsubscribeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUnsubscribeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
