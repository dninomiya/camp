import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

moment.locale('ja');

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {
  transform(date: any, args?: any): any {
    if (!date) {
      return null;
    } else if (typeof date === 'object') {
      return moment(date.toDate()).fromNow();
    } else {
      return moment(date).fromNow();
    }
  }

}
