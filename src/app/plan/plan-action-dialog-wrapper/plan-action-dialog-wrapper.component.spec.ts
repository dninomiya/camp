import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanActionDialogWrapperComponent } from './plan-action-dialog-wrapper.component';

describe('PlanActionDialogWrapperComponent', () => {
  let component: PlanActionDialogWrapperComponent;
  let fixture: ComponentFixture<PlanActionDialogWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanActionDialogWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanActionDialogWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
