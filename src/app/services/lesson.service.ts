import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LessonMeta, Lesson, LessonBody } from '../interfaces/lesson';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { switchMap, map, take, first } from 'rxjs/operators';
import { ChannelMeta } from '../interfaces/channel';
import { AngularFireFunctions } from '@angular/fire/functions';
import { LessonList } from '../interfaces/lesson-list';
import { Settlement } from '../interfaces/settlement';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { firestore } from 'firebase/app';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  async createLesson(
    authorId: string,
    lesson: Pick<
    Lesson,
    'title' | 'videoId' | 'public' | 'premium' | 'amount' | 'body'
    >,
    thumbnail?: string
  ): Promise<string> {
    const id = this.db.createId();
    const body = lesson.body;

    delete lesson.body;

    const data: LessonMeta = {
      id,
      authorId,
      channelId: authorId,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      viewCount: 0,
      likeCount: 0,
      deleted: false,
      ...lesson
    };

    let thumbnailURL: string;
    if (thumbnail) {
      thumbnailURL = await this.storageService.upload(`lessons/${id}/thumbnail`, thumbnail);
    }
    await this.db.doc(`lessons/${id}`).set(data);
    await this.db.doc(`lessons/${id}/body/content`).set({
      body,
      authorId,
      thumbnailURL
    });
    return id;
  }

  getLessonsByChannelId(cid: string, limit= 100): Observable<LessonMeta[]> {
    let lessons: LessonMeta[] = [];
    return this.db.collection<LessonMeta>('lessons', ref => {
      return ref.where('channelId', '==', cid).limit(limit);
    }).valueChanges().pipe(
      switchMap(items => {
        lessons = items;
        return this.db.doc<ChannelMeta>(`channels/${cid}`).valueChanges();
      }),
      map(channel => {
        return lessons.map(lesson => {
          return {
            channelName: channel.title,
            ...lesson
          };
        });
      })
    );
  }

  getLessonsByListId(lid: string): Observable<LessonMeta[]> {
    return this.db.doc<LessonList>(`lists/${lid}`)
      .valueChanges().pipe(
        switchMap(list => {
          if (list.lessonIds.length) {
            return combineLatest(list.lessonIds.map(id => {
              return this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges();
            }));
          } else {
            return of([]);
          }
        })
      );
  }

  getLessonMeta(id: string): Observable<LessonMeta> {
    return this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges();
  }

  getLesson(id: string): Observable<Lesson> {
    return combineLatest([
      this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges(),
      this.db.doc<LessonBody>(`lessons/${id}/body/content`).valueChanges()
    ]).pipe(
      map(([meta, content]) => {
        if (meta && content) {
          return {
            ...meta,
            ...content
          };
        } else {
          return null;
        }
      })
    );
  }

  async updateLesson(
    id: string,
    data: Partial<Pick<
      Lesson,
      'title' | 'videoId' | 'public' | 'premium' | 'amount' | 'body' | 'thumbnailURL'
    >>
  ): Promise<void> {
    const body = data.body;

    delete data.body;

    if (body) {
      await this.db.doc(`lessons/${id}/body/content`).update({
        body
      });
    }

    return this.db.doc(`lessons/${id}`).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  deleteLesson(id: string): Promise<void> {
    return this.db.doc(`lessons/${id}`).update({
      deleted: true
    });
  }

  like(uid: string, id: string): Promise<void> {
    return this.db.doc(`channels/${uid}/likes/${id}`).set({
      id
    });
  }

  unlike(uid: string, lessonId: string): Promise<void> {
    return this.db.doc(`channels/${uid}/likes/${lessonId}`).delete();
  }

  isLiked(uid: string, lessonId: string): Observable<boolean> {
    return this.db.doc(`channels/${uid}/likes/${lessonId}`).valueChanges()
      .pipe(map(lesson => !!lesson));
  }

  async countUpView(lessonId: string): Promise<void> {
    const callable = this.fns.httpsCallable('countUp');
    return callable({
      path: `lessons/${lessonId}`,
      key: 'viewCount'
    }).toPromise();
  }

  getOGPs(urls: string[]): Observable<object[]> {
    const collable = this.fns.httpsCallable('getOGP');
    return collable(urls);
  }

  checkPermission(lessonId: string, causeAuthorId?: string): Observable<boolean> {
    let uid: string;

    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of(false);
        }

        uid = user.uid;
        return this.db.doc(`users/${uid}/settlements/${lessonId}`)
          .valueChanges().pipe(map(settlement => !!settlement));
      }),
      switchMap(inLesson => {
        if (inLesson) {
          return of(true);
        } else {
          return this.db.collection<Settlement>(`users/${uid}/settlements`, ref => ref.where('type', '==', 'cause'))
            .valueChanges();
        }
      }),
      switchMap((settlements: Settlement[] | boolean) => {
        if (settlements === true) {
          return of(true);
        }

        if (!settlements || !settlements.length) {
          return of(false);
        }

        return forkJoin(
          settlements.map(settlement => {
            return this.db.doc<LessonList>(`lists/${settlement.id}`)
              .valueChanges().pipe(take(1));
          })
        );
      }),
      map((causes: LessonList[] | boolean) => {
        if (causes === false || causes === true) {
          return causes;
        } else {

          const inCause =  causes.find(cause => {
            if (!cause) {
              return false;
            }
            if (cause.authorId !== causeAuthorId) {
              return false;
            }
            return cause.lessonIds.find(id => id === lessonId);
          });
          return !!inCause;
        }
      })
    );
  }

  getThumbnail(id: string): Promise<string> {
    const uri = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`;
    return this.http.jsonp(uri, 'callback').pipe(
      map((res: any) => res.thumbnail_url),
      first()
    ).toPromise();
  }
}
