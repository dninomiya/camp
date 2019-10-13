import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification';
import { first } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private db: AngularFirestore
  ) { }

  getNotifications(uid: string): Observable<Notification[]> {
    return this.db.collection<Notification>(`users/${uid}/notifications`, ref => {
      return ref.orderBy('createdAt', 'desc');
    }).valueChanges();
  }

  async clearNotifications(uid: string): Promise<void[]> {
    const items = await this.db.collection<Notification>(`users/${uid}/notifications`)
      .valueChanges().pipe(first()).toPromise();
    return Promise.all(items.map(item => {
      if (item.isRead && moment().diff(moment(item.createdAt.toDate()), 'days') > 0) {
        return this.db.doc(`users/${uid}/notifications/${item.id}`).delete();
      } else {
        return this.db.doc(`users/${uid}/notifications/${item.id}`).update({
          isRead: true
        });
      }
    }));
  }
}
