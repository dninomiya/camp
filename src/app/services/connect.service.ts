import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  constructor(private db: AngularFirestore) { }

  updateAccount(userId: string, data): Promise<void> {
    return this.db.doc(`users/${userId}/connect/account`)
      .set(data, {merge: true});
  }

  getAccount(userId): Observable<any> {
    return this.db.doc(`users/${userId}/connect/account`).valueChanges();
  }
}
