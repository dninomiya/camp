import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(limit: number, ...args: any[]): any {
    if (limit) {
      return '月' + limit + '回';
    } else {
      return '無制限';
    }
  }

}
