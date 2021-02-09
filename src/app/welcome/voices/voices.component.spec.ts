import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicesComponent } from './voices.component';

describe('VoicesComponent', () => {
  let component: VoicesComponent;
  let fixture: ComponentFixture<VoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
