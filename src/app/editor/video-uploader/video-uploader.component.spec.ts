import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploaderComponent } from './video-uploader.component';

describe('VideoUploaderComponent', () => {
  let component: VideoUploaderComponent;
  let fixture: ComponentFixture<VideoUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
