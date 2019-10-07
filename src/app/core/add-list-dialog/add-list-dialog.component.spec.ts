import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListDialogComponent } from './add-list-dialog.component';

describe('AddListDialogComponent', () => {
  let component: AddListDialogComponent;
  let fixture: ComponentFixture<AddListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
