import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChannelService } from '../services/channel.service';

@Pipe({
  name: 'attachmentUser'
})
export class AttachmentUserPipe implements PipeTransform {
  constructor(private channelService: ChannelService) {}

  transform(datas: any[], ...args: any[]): any {
    return combineLatest(
      datas
      .map(data => data.authorId)
      .filter((uid, i, self) => self.indexOf(uid) === i)
      .map(uid => this.channelService.getChannel(uid))
    ).pipe(
      map(users => {
        return datas.filter(data => !data.deleted).map(data => {
          data.author = users.find(user => {
            return user.id === data.authorId;
          });
          return data;
        });
      }),
    );
  }
}
