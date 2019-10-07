import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChannelMeta, Follower } from '../interfaces/channel';
import { LessonList } from '../interfaces/lesson-list';
import { map, switchMap, take } from 'rxjs/operators';
import { JobCard } from '../interfaces/job-card';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private db: AngularFirestore
  ) { }

  getChannel(id: string): Observable<ChannelMeta> {
    return this.db.doc<ChannelMeta>(`channels/${id}`).valueChanges();
  }

  getListByChannelId(cid: string): Observable<LessonList[]> {
    return this.db.collection<LessonList>('lists', ref => {
      return ref.where('authorId', '==', cid);
    }).valueChanges();
  }

  follow(cid: string, uid: string) {
    this.db.doc(`channels/${cid}/followers/${uid}`).set({
      uid
    });
  }

  unfollow(cid: string, uid: string) {
    this.db.doc(`channels/${cid}/followers/${uid}`).delete();
  }

  isFollow(uid: string, channelId: string): Observable<boolean> {
    return this.db.doc(`channels/${channelId}/followers/${uid}`)
      .valueChanges().pipe(
        map(res => !!res)
      );
  }

  updateChannel(id: string, value: any): Promise<void> {
    return this.db.doc<ChannelMeta>(`channels/${id}`).update(value);
  }

  getFollows(cid: string): Observable<ChannelMeta[]> {
    return this.db.collection<Follower>(`channels/${cid}/followers`)
      .valueChanges().pipe(
        switchMap((items: Follower[]) => {
          return combineLatest(items.map(item => this.getChannel(item.uid)));
        })
      );
  }

  updateJob(id: string, jobCard: JobCard): Promise<void> {
    return this.db.doc(`channels/${id}/job/body`).set(jobCard, {
      merge: true
    });
  }

  getJobCard(id: string): Observable<JobCard> {
    return this.db.doc<JobCard>(`channels/${id}/job/body`)
      .valueChanges().pipe(take(1));
  }
}
