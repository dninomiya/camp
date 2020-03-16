import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsaComponent } from './isa.component';

describe('IsaComponent', () => {
  let component: IsaComponent;
  let fixture: ComponentFixture<IsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
