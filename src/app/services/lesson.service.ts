import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
import { Revision, LessonMetaWithUser } from './../interfaces/lesson';
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

    await this.http
      .post(
        'https://hooks.slack.com/services/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',
        {
          text: `「${data.title}」が投稿されました。ためになったら「いいね」しましょう！（投稿者にポイントが付与されます）\n${environment.host}?v=${id}`,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        }
      )
      .toPromise();

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

    await this.db.doc(`lessons/${id}`).update({
      ...data,
      updatedAt: new Date(),
    });

    await this.http
      .post(
        'https://hooks.slack.com/services/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',
        {
          text: `「${data.title}」が更新されました。\n${environment.host}?v=${id}`,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        }
      )
      .toPromise();
  }

  deleteLesson(id: string): Promise<void> {
    return this.db.doc(`lessons/${id}`).update({
      deleted: true,
      public: false,
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
    this.db.doc(`lessons/${lessonId}`).update({
      viewCount: firestore.FieldValue.increment(1),
    });
  }

  getOGPs(urls: string[]): Observable<object[]> {
    const collable = this.fns.httpsCallable('getOGP');
    return collable(urls);
  }

  checkPermission(lessonId: string): Observable<boolean> {
    return combineLatest([
      this.authService.authUser$.pipe(take(1)),
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

  getRevisions(lessonId: string): Observable<Revision[]> {
    return this.db
      .collection<Revision>(`lessons/${lessonId}/revisions`, (ref) => {
        return ref.where('isOpen', '==', true);
      })
      .valueChanges();
  }

  addRevision(
    params: Omit<Revision, 'id' | 'createdAt' | 'isOpen'>
  ): Promise<void> {
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

  rejectRevision(lessonId: string, revisionId: string): Promise<void> {
    return this.db
      .doc<Revision>(`lessons/${lessonId}/revisions/${revisionId}`)
      .delete();
  }

  getUpdatedLessons(): Observable<LessonMeta[]> {
    return this.getLessonsWithAuthor((ref) =>
      ref.where('public', '==', true).orderBy('updatedAt', 'desc').limit(8)
    );
  }

  getLikedLessons(): Observable<LessonMeta[]> {
    return this.getLessonsWithAuthor((ref) =>
      ref.where('public', '==', true).orderBy('likedCount', 'desc').limit(8)
    );
  }

  getLatestLessons(): Observable<LessonMetaWithUser[]> {
    return this.getLessonsWithAuthor((ref) =>
      ref.where('public', '==', true).orderBy('createdAt', 'desc').limit(8)
    );
  }

  private getLessonsWithAuthor(query): Observable<LessonMetaWithUser[]> {
    return this.db
      .collection<LessonMeta>('lessons', query)
      .valueChanges()
      .pipe(
        switchMap((metas) => {
          const uids = Array.from(new Set(metas.map((meta) => meta.authorId)));
          const users$: Observable<User>[] = uids.map((uid) =>
            this.db.doc<User>(`users/${uid}`).valueChanges()
          );

          return combineLatest([of(metas), combineLatest(users$)]);
        }),
        map(([metas, users]) => {
          return metas.map((meta) => {
            return {
              ...meta,
              author: users.find((user) => user.id === meta.authorId),
            };
          });
        })
      );
  }
}
