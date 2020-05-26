import { firestore } from 'firebase/app';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  getUser(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  updateUser(
    uid: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'admin'>>
  ): Promise<void> {
    console.log(data);
    return this.db.doc<User>(`users/${uid}`).update(data);
  }

  getRanking(): Observable<User[]> {
    return this.db
      .collection<User>('users', (ref) => {
        return ref.orderBy('point', 'desc').limit(5);
      })
      .valueChanges();
  }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges();
  }

  async createInviteCode(): Promise<string> {
    const id = this.db.createId();
    await this.db.doc(`inviteCodes/${id}`).set({
      status: true,
    });
    return id;
  }

  completeTask(uid: string, taskId: string): Promise<void> {
    return this.db.doc(`users/${uid}`).update({
      tasks: firestore.FieldValue.arrayUnion(taskId),
    });
  }

  getSkillStatus(uid: string): Observable<object> {
    return this.db.doc<object>(`users/${uid}/skills/status`).valueChanges();
  }

  completeSkill(uid: string, skillId: string): Promise<void> {
    return this.db.doc(`users/${uid}/skills/status`).set(
      {
        [skillId]: true,
      },
      { merge: true }
    );
  }

  uncompleteSkill(uid: string, skillId: string): Promise<void> {
    return this.db.doc(`users/${uid}/skills/status`).set(
      {
        [skillId]: firestore.FieldValue.delete(),
      },
      { merge: true }
    );
  }
}
