import { AttachmentUserPipe } from './attachment-user.pipe';
import { ChannelService } from '../services/channel.service';
import { inject } from '@angular/core/testing';

describe('AttachmentUserPipe', () => {
  it('create an instance', inject([ChannelService], (channelService: ChannelService) => {
    const pipe = new AttachmentUserPipe(channelService);
    expect(pipe).toBeTruthy();
  }));
});
