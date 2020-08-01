import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChannelMeta, Follower } from '../interfaces/channel';
import { LessonList } from '../interfaces/lesson-list';
import { map, switchMap, take } from 'rxjs/operators';
import { Job, Jobs } from '../interfaces/job';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private db: AngularFirestore) {}

  getChannel(id: string): Observable<ChannelMeta> {
    return this.db.doc<ChannelMeta>(`channels/${id}`).valueChanges();
  }

  getListByChannelId(cid: string): Observable<LessonList[]> {
    return this.db
      .collection<LessonList>('lists', (ref) => {
        return ref.where('authorId', '==', cid);
      })
      .valueChanges();
  }

  follow(cid: string, uid: string) {
    this.db.doc(`channels/${cid}/followers/${uid}`).set({
      uid,
    });
  }

  unfollow(cid: string, uid: string) {
    this.db.doc(`channels/${cid}/followers/${uid}`).delete();
  }

  isFollow(uid: string, channelId: string): Observable<boolean> {
    return this.db
      .doc(`channels/${channelId}/followers/${uid}`)
      .valueChanges()
      .pipe(map((res) => !!res));
  }

  updateChannel(id: string, value: Partial<ChannelMeta>): Promise<void> {
    return this.db.doc(`channels/${id}`).set(value, {
      merge: true,
    });
  }

  getFollows(cid: string): Observable<ChannelMeta[]> {
    return this.db
      .collection<Follower>(`channels/${cid}/followers`)
      .valueChanges()
      .pipe(
        switchMap((items: Follower[]) => {
          if (items.length) {
            return combineLatest(
              items.map((item) => this.getChannel(item.uid))
            );
          } else {
            return of([]);
          }
        })
      );
  }

  updateJobs(channelId: string, items: Job[]): Promise<void> {
    return this.db.doc(`channels/${channelId}/jobs/data`).set({ items });
  }

  getJobs(channelId): Observable<Job[]> {
    return this.db
      .doc<Jobs>(`channels/${channelId}/jobs/data`)
      .valueChanges()
      .pipe(
        take(1),
        map((result) => {
          if (result) {
            return result.items;
          } else {
            return [];
          }
        })
      );
  }
}
