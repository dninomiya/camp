import { Pipe, PipeTransform } from '@angular/core';
import { ChannelMeta } from '../interfaces/channel';

@Pipe({
  name: 'rate'
})
export class RatePipe implements PipeTransform {

  transform(channel: ChannelMeta, ...args: any[]): any {
    if (channel.totalRate && channel.totalRate) {
      return channel.totalRate / channel.statistics.reviewCount;
    } else {
      return 0;
    }
  }

}
