import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumGuideComponent } from './forum-guide.component';

describe('ForumGuideComponent', () => {
  let component: ForumGuideComponent;
  let fixture: ComponentFixture<ForumGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
