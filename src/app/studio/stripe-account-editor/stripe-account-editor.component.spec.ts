import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeAccountEditorComponent } from './stripe-account-editor.component';

describe('StripeAccountEditorComponent', () => {
  let component: StripeAccountEditorComponent;
  let fixture: ComponentFixture<StripeAccountEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeAccountEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
