import { PlanID } from './../interfaces/plan';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mtgType',
})
export class MtgTypePipe implements PipeTransform {
  transform(plan: PlanID): unknown {
    switch (plan) {
      case 'mentor':
      case 'isa':
        return '毎日';
      case 'mentorLite':
        return '週末';
    }
  }
}
