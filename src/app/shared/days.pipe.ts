import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { firestore } from 'firebase/app';

@Pipe({
  name: 'days'
})
export class DaysPipe implements PipeTransform {

  transform(timestamp: firestore.Timestamp, args?: any): any {
    const days = moment().diff(moment(timestamp.toDate()), 'days');
    return days;
  }

}
