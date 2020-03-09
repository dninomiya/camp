import { Injectable } from '@angular/core';
import { Plan } from '../interfaces/plan';

export const PLANS: Plan[] = [
  {
    id: 'lite',
    title: 'ライト',
    subTitle: '教材閲覧のみ',
    amount: 12500,
    points: ['有料教材の閲覧']
  },
  {
    id: 'solo',
    title: 'ソロ',
    subTitle: 'ひとりで学びたい人',
    amount: 30000,
    points: ['有料教材の閲覧', '質問し放題']
  },
  {
    id: 'mentor',
    title: 'メンター',
    subTitle: 'メンターと進めたい人',
    amount: 85000,
    points: [
      '有料教材の閲覧',
      '質問し放題',
      'コードレビュー',
      '進捗管理',
      'サービス企画',
      '開発顧問',
      '就職支援'
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  plans = PLANS;

  constructor() { }

  getPlan(planId: string): Plan {
    return this.plans.find(plan => plan.id === planId);
  }

  isUpgrade(oldPlanId: string, newPlanId: string) {
    const oldPlanIndex = this.plans.findIndex(plan => plan.id === oldPlanId);
    const newPlanIndex = this.plans.findIndex(plan => plan.id === newPlanId);
    return newPlanIndex - oldPlanIndex > 0;
  }
}
