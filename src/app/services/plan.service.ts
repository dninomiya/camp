import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Plan } from '../interfaces/plan';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private sort = ['question', 'review', 'trouble', 'coaching'];

  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

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
