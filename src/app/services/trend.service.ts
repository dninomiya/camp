import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { Lesson, LessonMeta } from '../interfaces/lesson';
import { switchMap, first, take } from 'rxjs/operators';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class TrendService {

  constructor(
    private db: AngularFirestore,
    private utilService: UtilService
  ) { }

  getTrend(): Observable<LessonMeta[]> {
    return this.db.collection<LessonMeta>('lessons', ref => {
      return ref.orderBy('createdAt', 'desc').limit(40);
    }).valueChanges().pipe(
      switchMap(lessons => {
        return this.utilService.attachChannel(lessons);
      })
    );
  }

  getFavirite(channelId: string): Observable<LessonMeta[]> {
    return this.db.collection<Lesson>(`channels/${channelId}/likes`, ref => {
      return ref.limit(20);
    }).valueChanges().pipe(
      switchMap(items => {
        return combineLatest(
          items.map(item => {
            return this.db.doc<LessonMeta>(`lessons/${item.id}`).valueChanges();
          })
        );
      })
    );
  }
}
