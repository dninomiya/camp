import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumRootComponent } from './forum-root.component';

describe('ForumRootComponent', () => {
  let component: ForumRootComponent;
  let fixture: ComponentFixture<ForumRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
