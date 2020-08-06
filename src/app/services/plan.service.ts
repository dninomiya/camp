import { Injectable } from '@angular/core';
import { Plan } from '../interfaces/plan';
import * as moment from 'moment';

export const PLAN: {
  [key: string]: Omit<Plan, 'id'>;
} = {
  lite: {
    title: 'ライト',
    subTitle: '教材閲覧のみ',
    points: [
      '有料教材の閲覧',
      '教材に関する質問',
      '勉強会（任意参加）',
      'チーム開発（任意参加）',
    ],
  },
  solo: {
    title: 'ソロ',
    subTitle: 'ひとりで学びたい人',
    points: [
      '有料教材の閲覧',
      '無制限な質問',
      '勉強会（任意参加）',
      'チーム開発（任意参加）',
    ],
  },
  mentor: {
    title: 'メンター',
    subTitle: 'メンターと進めたい人',
    points: [
      '有料教材の閲覧',
      '無制限な質問',
      'コードレビュー',
      '進捗管理',
      'サービス企画',
      '開発顧問',
      '就職支援',
      'ペアプロ',
      'マンツーレッスン',
      '勉強会（任意参加）',
      'チーム開発（任意参加）',
    ],
  },
};

export const PLANS: Plan[] = Object.entries(PLAN).map(([id, value]) => ({
  id,
  ...value,
}));

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  plans = PLANS;
  plan = this.plans.reduce((obj, plan) => {
    obj[plan.id] = plan;
    return obj;
  }, {});
  isCampaign = moment().isBefore('2020-05-01');

  constructor() {}

  getPlan(planId: string): Plan {
    return this.plans.find((plan) => plan.id === planId);
  }

  isUpgrade(oldPlanId: string, newPlanId: string) {
    const oldPlanIndex = this.plans.findIndex((plan) => plan.id === oldPlanId);
    const newPlanIndex = this.plans.findIndex((plan) => plan.id === newPlanId);
    return newPlanIndex - oldPlanIndex > 0;
  }
}
