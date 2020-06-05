import { Revision } from './../interfaces/lesson';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LessonMeta, Lesson, LessonBody } from '../interfaces/lesson';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, first, take } from 'rxjs/operators';
import { ChannelMeta } from '../interfaces/channel';
import { AngularFireFunctions } from '@angular/fire/functions';
import { LessonList } from '../interfaces/lesson-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firestore } from 'firebase/app';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions,
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  async createLesson(
    authorId: string,
    lesson: Pick<Lesson, 'title' | 'videoId' | 'public' | 'free' | 'body'>,
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
      deleted: false,
      ...lesson,
    };

    let thumbnailURL: string;
    if (thumbnail) {
      thumbnailURL = await this.storageService.upload(
        `lessons/${id}/thumbnail`,
        thumbnail
      );
    }
    await this.db.doc(`lessons/${id}`).set({
      ...data,
      thumbnailURL: thumbnailURL || null,
    });
    await this.db.doc(`lessons/${id}/body/content`).set({
      body,
      authorId,
    });

    // await this.sendSlack(
    //   `test` +
    //     'https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq\n' +
    //     environment.host +
    //     '/lessons?v=' +
    //     data.id
    // );

    return id;
  }

  getLessonsByChannelId(cid: string, limit = 100): Observable<LessonMeta[]> {
    let lessons: LessonMeta[] = [];
    return this.db
      .collection<LessonMeta>('lessons', (ref) => {
        return ref
          .where('channelId', '==', cid)
          .where('deleted', '==', false)
          .where('public', '==', true)
          .limit(limit)
          .orderBy('createdAt', 'desc');
      })
      .valueChanges()
      .pipe(
        switchMap((items) => {
          lessons = items;
          return this.db.doc<ChannelMeta>(`channels/${cid}`).valueChanges();
        }),
        map((channel) => {
          return lessons.map((lesson) => {
            return {
              channelName: channel.title,
              ...lesson,
            };
          });
        })
      );
  }

  getLessonsByListId(lid: string): Observable<LessonMeta[]> {
    return this.db
      .doc<LessonList>(`lists/${lid}`)
      .valueChanges()
      .pipe(
        switchMap((list) => {
          if (list.lessonIds.length) {
            return combineLatest(
              list.lessonIds.map((id) => {
                return this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges();
              })
            );
          } else {
            return of([]);
          }
        })
      );
  }

  getLessonMeta(id: string): Observable<LessonMeta> {
    return this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges();
  }

  getLessonBody(id: string): Observable<LessonBody> {
    return this.db.doc<LessonBody>(`lessons/${id}/body/content`).valueChanges();
  }

  getLesson(id: string): Observable<Lesson> {
    return combineLatest([
      this.db.doc<LessonMeta>(`lessons/${id}`).valueChanges(),
      this.db.doc<LessonBody>(`lessons/${id}/body/content`).valueChanges(),
    ]).pipe(
      map(([meta, content]) => {
        if (meta && content) {
          return {
            ...meta,
            ...content,
          };
        } else {
          return null;
        }
      })
    );
  }

  async updateLesson(
    id: string,
    data: Partial<
      Pick<
        Lesson,
        'title' | 'videoId' | 'public' | 'free' | 'body' | 'thumbnailURL'
      >
    >
  ): Promise<void> {
    const body = data.body;

    delete data.body;

    if (body) {
      await this.db.doc(`lessons/${id}/body/content`).update({
        body,
      });
    }

    // await this.sendSlack(
    //   `test` +
    //     'https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq\n' +
    //     environment.host +
    //     '/lessons?v=' +
    //     id
    // );

    return this.db.doc(`lessons/${id}`).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  deleteLesson(id: string): Promise<void> {
    return this.db.doc(`lessons/${id}`).update({
      deleted: true,
    });
  }

  like(uid: string, id: string): Promise<void> {
    return this.db.doc(`channels/${uid}/likes/${id}`).set({
      id,
    });
  }

  unlike(uid: string, lessonId: string): Promise<void> {
    return this.db.doc(`channels/${uid}/likes/${lessonId}`).delete();
  }

  isLiked(uid: string, lessonId: string): Observable<boolean> {
    return this.db
      .doc(`channels/${uid}/likes/${lessonId}`)
      .valueChanges()
      .pipe(map((lesson) => !!lesson));
  }

  countUpView(lessonId: string): Promise<void> {
    if (!lessonId) {
      return;
    }
    const callable = this.fns.httpsCallable('countUp');
    return callable({
      path: `lessons/${lessonId}`,
      key: 'viewCount',
    }).toPromise();
  }

  getOGPs(urls: string[]): Observable<object[]> {
    const collable = this.fns.httpsCallable('getOGP');
    return collable(urls);
  }

  checkPermission(lessonId: string): Observable<boolean> {
    return combineLatest([
      this.authService.authUser$,
      this.db
        .doc<LessonMeta>(`lessons/${lessonId}`)
        .valueChanges()
        .pipe(take(1)),
    ]).pipe(
      map(([user, lesson]) => {
        return lesson.free || (user?.plan && user.plan !== 'free');
      })
    );
  }

  getThumbnail(id: string): Promise<string> {
    const uri = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`;
    return this.http
      .jsonp(uri, 'callback')
      .pipe(
        map((res: any) => res.thumbnail_url),
        first()
      )
      .toPromise();
  }

  addRevision(params: Omit<Revision, 'id' | 'createdAt'>): Promise<void> {
    const id = this.db.createId();
    return this.db
      .doc<Revision>(`lessons/${params.lessonId}/revisions/${id}`)
      .set({
        ...params,
        id,
        isOpen: true,
        createdAt: firestore.Timestamp.now(),
      });
  }

  removeRevision(lessonId: string, revisionId: string): Promise<void> {
    return this.db.doc(`lessons/${lessonId}/revisions/${revisionId}`).delete();
  }

  updateRevision(
    lessonId: string,
    revisionId: string,
    newDoc: string
  ): Promise<void> {
    return this.db
      .doc<Revision>(`lessons/${lessonId}/revisions/${revisionId}`)
      .update({
        newDoc,
      });
  }

  acceptRevision(lessonId: string, revisionId: string): Promise<void> {
    return this.db
      .doc<Revision>(`lessons/${lessonId}/revisions/${revisionId}`)
      .update({
        isOpen: false,
      });
  }
}
