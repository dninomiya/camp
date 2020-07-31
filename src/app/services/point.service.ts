import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  constructor(private db: AngularFirestore) {}

  incrementPoint(uid: string, point: number) {
    return this.db.doc(`users/${uid}`).update({
      point: firestore.FieldValue.increment(point),
    });
  }
}
