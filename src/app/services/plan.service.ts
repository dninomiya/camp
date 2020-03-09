import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Plan } from '../interfaces/plan';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';

export const PLANS = [
  {
    id: 'lite',
    title: 'ライト',
    subTitle: '教材閲覧のみ',
    price: 5000,
    factPrice: 12500,
    points: ['有料教材の閲覧']
  },
  {
    id: 'lite',
    title: 'ソロ',
    subTitle: 'ひとりで学びたい人',
    price: 10000,
    factPrice: 30000,
    points: ['有料教材の閲覧', '質問し放題']
  },
  {
    id: 'standard',
    title: 'メンター',
    subTitle: 'メンターと進めたい人',
    price: 50000,
    factPrice: 85000,
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
  private sort = ['question', 'review', 'trouble', 'coaching'];
  plans = PLANS;

  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) { }

  getPlansByChannelId(cid: string): Observable<Plan[]> {
    return this.db
      .collection<Plan>(`channels/${cid}/plans`)
      .valueChanges()
      .pipe(
        map(plans => {
          return this.sort
            .map(type => plans.find(plan => plan.type === type))
            .filter(plan => !!plan);
        })
      );
  }

  getPlan(userId: string, type: string): Observable<Plan> {
    return this.db.doc<Plan>(`channels/${userId}/plans/${type}`).valueChanges();
  }

  createPlan(plan: Plan): Promise<void> {
    const collable = this.fns.httpsCallable('createPlan');
    return collable(plan).toPromise();
  }

  updatePlan(channelId: string, plan: Plan) {
    return this.db.doc(`channels/${channelId}/plans/${plan.type}`).update(plan);
  }

  deletePlan(id: string) {
    const collable = this.fns.httpsCallable('deletePlan');
    return collable({ id }).toPromise();
  }
}
