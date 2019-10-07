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

  createJob(channelId: string, jobCard: JobCard): Promise<void> {
    const id = this.db.createId();
    return this.db.doc(`channels/${channelId}/jobs/${id}`).set({
      id,
      ...jobCard
    }, {
      merge: true
    });
  }

  updateJob(channelId: string, jobCard: JobCard, jobId: string): Promise<void> {
    const id = this.db.createId();
    return this.db.doc(`channels/${channelId}/jobs/${id}`).set({
      id,
      ...jobCard
    }, {
      merge: true
    });
  }

  getJob(channelId: string, jobId: string): Observable<JobCard> {
    return this.db.doc<JobCard>(`channels/${channelId}/jobs/${jobId}`)
      .valueChanges().pipe(take(1));
  }

  getJobs(channelId): Observable<JobCard[]> {
    return this.db.collection<JobCard>(`channels/${channelId}/jobs`)
      .valueChanges().pipe(take(1));
  }
}
