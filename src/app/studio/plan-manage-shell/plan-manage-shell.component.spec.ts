import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanManageShellComponent } from './plan-manage-shell.component';

describe('PlanManageShellComponent', () => {
  let component: PlanManageShellComponent;
  let fixture: ComponentFixture<PlanManageShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanManageShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanManageShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
