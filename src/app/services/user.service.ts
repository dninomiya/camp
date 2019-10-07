import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore
  ) { }

  getUser(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  updateUser(uid: string, data): Promise<void> {
    return this.db.doc<User>(`users/${uid}`).update(data);
  }

  getRanking(): Observable<User[]> {
    return this.db.collection<User>('users', ref => {
      return ref.orderBy('point', 'desc').limit(5);
    }).valueChanges();
  }

  getUsers(plan?: string): Observable<User[]> {
    if (plan) {
      return this.db.collection<User>('users', ref => {
        return ref.where('plan', '==', plan);
      }).valueChanges();
    } else {
      return this.db.collection<User>('users').valueChanges();
    }
  }

  async createInviteCode(): Promise<string> {
    const id = this.db.createId();
    await this.db.doc(`inviteCodes/${id}`).set({
      status: true
    });
    return id;
  }
}
