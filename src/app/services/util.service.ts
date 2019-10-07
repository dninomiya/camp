import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChannelMeta } from '../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private db: AngularFirestore
  ) { }

  attachChannel(list: any[]): Observable<any[]> {
    return combineLatest(
      list
        .map(data => data.authorId)
        .filter((uid, i, self) => self.indexOf(uid) === i)
        .map(uid => this.db.doc(`channels/${uid}`).valueChanges())
      ).pipe(
        map(channels => {
          return list.map(data => {
            data.author = channels.find((channel: ChannelMeta) => {
              return channel.id === data.authorId;
            });
            return data;
          });
        }),
      );
    }
}
