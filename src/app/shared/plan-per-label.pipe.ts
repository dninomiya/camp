import { Pipe, PipeTransform } from '@angular/core';
import { PlanPer } from '../interfaces/plan';

@Pipe({
  name: 'planPerLabel'
})
export class PlanPerLabelPipe implements PipeTransform {

  transform(planType: PlanPer, ...args: any[]): any {
    switch (planType) {
      case 'time':
        return '回';
      case 'coaching':
        return '30分';
      case 'month':
        return '月';
    }
  }
}
