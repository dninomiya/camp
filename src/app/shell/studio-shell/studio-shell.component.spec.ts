import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioShellComponent } from './studio-shell.component';

describe('StudioShellComponent', () => {
  let component: StudioShellComponent;
  let fixture: ComponentFixture<StudioShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
