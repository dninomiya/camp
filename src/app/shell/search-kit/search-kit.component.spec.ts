import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKitComponent } from './search-kit.component';

describe('SearchKitComponent', () => {
  let component: SearchKitComponent;
  let fixture: ComponentFixture<SearchKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
