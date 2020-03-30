import { LessonMeta } from 'src/app/interfaces/lesson';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LessonList } from '../interfaces/lesson-list';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map, switchMap, filter } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Lesson } from '../interfaces/lesson';
import { ChannelMeta } from '../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(
    private db: AngularFirestore,
    private storageService: StorageService
  ) {}

  getLists(channelId: string): Observable<LessonList[]> {
    const channel$ = this.db
      .doc<ChannelMeta>(`channels/${channelId}`)
      .valueChanges();
    const lists$ = this.db
      .collection<LessonList>('lists', ref => {
        return ref.where('authorId', '==', channelId);
      })
      .valueChanges();

    return combineLatest([channel$, lists$]).pipe(
      map(([channel, lists]) => {
        if (channel.listOrder) {
          return channel.listOrder
            .map(id => lists.find(list => list.id === id))
            .filter(cause => !!cause);
        } else {
          return lists;
        }
      })
    );
  }

  getList(id: string): Observable<LessonList> {
    return this.db.doc<LessonList>(`lists/${id}`).valueChanges();
  }

  async createList(
    params: {
      title: string;
      authorId: string;
      private: boolean;
      description: string;
    },
    file?: string
  ): Promise<void> {
    const id = this.db.createId();
    const data: LessonList = {
      id,
      lessonIds: [],
      ...params,
      createdAt: new Date()
    };

    if (file) {
      data.coverURL = await this.storageService.upload(`causes/${id}`, file);
    }

    await this.db.doc(`lists/${id}`).set(data);

    const channel = (
      await this.db.doc(`channels/${params.authorId}`).ref.get()
    ).data() as ChannelMeta;
    const listOrder = channel.listOrder;
    listOrder.push(id);

    return this.db.doc(`channels/${params.authorId}`).update({ listOrder });
  }

  async updateList(params: {
    id: string;
    data: Partial<Omit<LessonList, 'id' | 'createdAt' | 'createdAt'>>;
    file?: string;
  }): Promise<void> {
    if (params.file) {
      params.data.coverURL = await this.storageService.upload(
        `causes/${params.id}`,
        params.file
      );
    }

    if (params.data.lessonIds && params.data.lessonIds[0]) {
      params.data.firstLessonId = params.data.lessonIds[0];
    }

    return this.db.doc(`lists/${params.id}`).update(params.data);
  }

  removeLessonFromList(
    allLists: LessonList[],
    lessonId: string
  ): Promise<void[]> {
    return Promise.all(
      allLists
        .filter(list => list && list.lessonIds.includes(lessonId))
        .map(list => {
          const i = list.lessonIds.findIndex(id => id === lessonId);
          list.lessonIds.splice(i, 1);
          return this.db.doc(`lists/${list.id}`).update(list);
        })
    );
  }

  patchList(params: {
    allLists: LessonList[];
    activeListIds: string[];
    lessonId: string;
  }): Promise<void[]> {
    const { allLists, activeListIds, lessonId } = params;
    return Promise.all(
      allLists.map(list => {
        if (activeListIds.includes(list.id)) {
          if (!list.lessonIds.includes(lessonId)) {
            list.lessonIds.push(lessonId);
          }
        } else {
          if (list.lessonIds.includes(lessonId)) {
            const i = list.lessonIds.findIndex(id => id === lessonId);
            list.lessonIds.splice(i, 1);
          }
        }
        return this.db.doc(`lists/${list.id}`).update({
          ...list,
          firstLessonId: list.lessonIds[0] || null
        });
      })
    );
  }

  async deleteList(channelId: string, id: string): Promise<void> {
    const channel = (
      await this.db.doc(`channels/${channelId}`).ref.get()
    ).data() as ChannelMeta;
    const listOrder = channel.listOrder;
    const index = listOrder.indexOf(id);
    listOrder.splice(index, 1);

    await this.db.doc(`channels/${channelId}`).update({ listOrder });
    return this.db.doc(`lists/${id}`).delete();
  }

  getParentCauseWithLesson(lesson: LessonMeta): Observable<LessonList> {
    return this.db
      .collection('lists', ref => {
        return ref
          .where('premium', '==', true)
          .where('authorId', '==', lesson.authorId)
          .where('lessonIds', 'array-contains', lesson.id);
      })
      .valueChanges()
      .pipe(
        map((cause: LessonList[]) => {
          if (cause && cause.length) {
            return cause[0];
          }
        })
      );
  }
}
