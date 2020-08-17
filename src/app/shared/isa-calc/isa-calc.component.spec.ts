import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsaCalcComponent } from './isa-calc.component';

describe('IsaCalcComponent', () => {
  let component: IsaCalcComponent;
  let fixture: ComponentFixture<IsaCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsaCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsaCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
