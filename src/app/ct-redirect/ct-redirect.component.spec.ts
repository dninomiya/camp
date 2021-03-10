import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtRedirectComponent } from './ct-redirect.component';

describe('CtRedirectComponent', () => {
  let component: CtRedirectComponent;
  let fixture: ComponentFixture<CtRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
