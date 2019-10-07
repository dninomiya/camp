import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEditDialogComponent } from './list-edit-dialog.component';

describe('ListEditDialogComponent', () => {
  let component: ListEditDialogComponent;
  let fixture: ComponentFixture<ListEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
