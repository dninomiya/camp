import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanManageComponent } from './plan-manage.component';

describe('PlanManageComponent', () => {
  let component: PlanManageComponent;
  let fixture: ComponentFixture<PlanManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
