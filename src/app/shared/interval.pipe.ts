import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interval',
})
export class IntervalPipe implements PipeTransform {
  transform(interval: string): string {
    switch (interval) {
      case 'day':
        return '日';
      case 'month':
        return 'か月';
      case 'year':
        return '年';
    }
  }
}
