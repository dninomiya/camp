import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectVimeoComponent } from './connect-vimeo.component';

describe('ConnectVimeoComponent', () => {
  let component: ConnectVimeoComponent;
  let fixture: ComponentFixture<ConnectVimeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectVimeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectVimeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
