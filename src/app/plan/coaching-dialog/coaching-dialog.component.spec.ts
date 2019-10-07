import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingDialogComponent } from './coaching-dialog.component';

describe('CoachingDialogComponent', () => {
  let component: CoachingDialogComponent;
  let fixture: ComponentFixture<CoachingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
