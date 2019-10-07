import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseWidgetComponent } from './cause-widget.component';

describe('CauseWidgetComponent', () => {
  let component: CauseWidgetComponent;
  let fixture: ComponentFixture<CauseWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauseWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
