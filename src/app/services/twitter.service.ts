import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(
    private fns: AngularFireFunctions,
    private db: AngularFirestore,
  ) { }

  async tweet(uid: string, body: string): Promise<number> {
    const callable = this.fns.httpsCallable('tweetLog');
    await this.db.doc(`users/${uid}`).update({
      lastTweetedAt: firestore.Timestamp.now()
    });
    return callable({uid, body}).pipe(first()).toPromise();
  }
}
