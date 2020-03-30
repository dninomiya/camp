import { PlanService } from 'src/app/services/plan.service';
import { PlanID } from './../interfaces/plan';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plan'
})
export class PlanPipe implements PipeTransform {
  constructor(private planService: PlanService) {}

  transform(planId: PlanID): any {
    switch (planId) {
      case 'free':
        return 'フリー';
      case 'admin':
        return '管理人';
      case 'isa':
        return 'ISA';
      default:
        return this.planService.plans.find(plan => plan.id === planId).title;
    }
  }
}
