import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelReviewDialogComponent } from './channel-review-dialog.component';

describe('ChannelReviewDialogComponent', () => {
  let component: ChannelReviewDialogComponent;
  let fixture: ComponentFixture<ChannelReviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelReviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
