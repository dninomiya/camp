import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plan'
})
export class PlanPipe implements PipeTransform {

  transform(plan: 'free' | 'isa' | 'standard', ...args: any[]): any {
    switch (plan) {
      case 'free':
        return 'フリー';
      case 'isa':
        return 'ISA';
      case 'standard':
        return 'スタンダード';
      default:
        return 'フリー';
    }
  }

}
