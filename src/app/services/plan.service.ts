import { firestore } from 'firebase/app';
import { PlanData, PlanOrder } from './../interfaces/plan';
import { map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  planLabel = {
    lite: 'ライト',
    solo: 'ソロ',
    mentor: 'メンター',
    mentorLite: '週末メンター',
    admin: '管理人',
    isa: 'ISA',
    free: 'フリー',
  };

  constructor(private db: AngularFirestore) {}

  getPlan(planId: string): Promise<PlanData> {
    return this.db
      .doc<PlanData>(`plans/${planId}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }

  savePlan(plan: PlanData) {
    this.db.doc(`plans/${plan.id}`).set(plan);
    this.db.doc('core/planOrder').set(
      {
        order: firestore.FieldValue.arrayUnion(plan.id),
      },
      { merge: true }
    );
  }

  getPlans(): Promise<PlanData[]> {
    return combineLatest([
      this.db.collection<PlanData>('plans').valueChanges(),
      this.db.doc<PlanOrder>('core/planOrder').valueChanges(),
    ])
      .pipe(
        map(([plans, doc]) => {
          if (doc?.order?.length) {
            return doc.order.map((id) => {
              return plans.find((plan) => plan.id === id);
            });
          } else {
            return null;
          }
        }),
        take(1)
      )
      .toPromise();
  }
}
