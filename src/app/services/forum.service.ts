import { Injectable } from '@angular/core';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { Thread, ThreadReply } from '../interfaces/thread';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { ChannelMeta } from '../interfaces/channel';
import { Review } from '../interfaces/review';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) { }

  getList(status: string, authorId: string): Observable<Thread[]> {
    let itemsTmp: Thread[];

    return combineLatest([
      this.db.collection<Thread>('threads', ref => {
        return ref
          .where('authorId', '==', authorId)
          .where('status', '==', status);
      }).valueChanges().pipe(
        map((list) => {
          return list.map(item => {
            return {
              isOwner: true,
              ...item
            };
          });
        })
      ),
      this.db.collection<Thread>('threads', ref => {
        return ref
          .where('targetId', '==', authorId)
          .where('status', '==', status);
      }).valueChanges().pipe(
        map((list) => {
          return list.map(item => {
            return {
              isOwner: false,
              ...item
            };
          });
        })
      ),
    ]).pipe(
      switchMap(([list1, list2]) => {
        if (!list1.length && !list2.length) {
          itemsTmp = [];
          return of([]);
        }
        const items = list1.concat(list2);
        itemsTmp = items;
        return forkJoin(
          items
            .map(item => {
              if (item.isOwner) {
                return item.targetId;
              } else {
                return item.authorId;
              }
            })
            .filter((x, i, self) => self.indexOf(x) === i)
            .map(uid => {
              return this.db.doc<ChannelMeta>(`channels/${uid}`).valueChanges().pipe(take(1));
            })
          );
      }),
      map(channels => {
        if (!itemsTmp.length || !channels.length) {
          return [];
        }
        return itemsTmp.map(item => {
          item.user = channels.find(channel => channel.authorId === item.authorId);
          return item;
        });
      })
    );
  }

  getThread(id: string): Observable<Thread> {
    let threadTmp: Thread;
    return this.db.doc<Thread>(`threads/${id}`)
      .valueChanges()
      .pipe(
        switchMap(thread => {
          threadTmp = thread;
          return this.db.doc<User>(`channels/${thread.authorId}`).valueChanges();
        }),
        map(author => {
          return {
            ...threadTmp,
            author
          };
        })
      );
  }

  addReply(params: {
    threadId: string,
    authorId: string
    thread: Thread,
    body: string,
  }): Promise<void> {
    const id = this.db.createId();
    return this.db.doc(`threads/${params.threadId}/replies/${id}`).set({
      id,
      authorId: params.authorId,
      body: params.body,
      thread: params.thread,
      createdAt: new Date()
    });
  }

  getReplies(threadId: string): Observable<ThreadReply[]> {
    let tmpReplies;

    return this.db.collection<ThreadReply>(`threads/${threadId}/replies`, ref => {
      return ref.orderBy('createdAt', 'asc');
    }).valueChanges().pipe(
      switchMap(replies => {
        tmpReplies = replies;
        return forkJoin(
          replies
          .map(reply => reply.authorId)
          .filter((uid, i, self) => self.indexOf(uid) === i)
          .map(uid => {
            return this.db.doc<ChannelMeta>(`channels/${uid}`).valueChanges().pipe(take(1));
          })
        );
      }),
      map(users => {
        return tmpReplies.map(reply => {
          reply.author = users.find(user => user.id === reply.authorId);
          return reply;
        });
      })
    );
  }

  async createThread(params: Pick<
    Thread, 'title' | 'body'| 'plan' | 'targetId' | 'authorId' | 'sellerEmail'>): Promise<{
    id: string;
    targetId: string;
  }> {
    const id = this.db.createId();

    await this.db.doc(`threads/${id}`).set({
      createdAt: new Date(),
      status: 'request',
      id,
      ...params
    });

    return {
      id,
      targetId: params.targetId
    };
  }

  updateThread(id: string, data: any): Promise<void> {
    return this.db.doc(`threads/${id}`).update(data);
  }

  addUnreadCount(uid: string, thread: Thread): Promise<void[]> {
    const collable = this.fns.httpsCallable('countUp');
    return Promise.all([
      collable({
        path: `channels/${uid}`,
        key: `unreadThread.${thread.status}`
      }).toPromise(),
      collable({
        path: `threads/${thread.id}`,
        key: `unreadCount.${uid}`
      }).toPromise(),
    ]);
  }

  getUnreadCount(uid: string) {
    return this.db.doc<ChannelMeta>(`channels/${uid}`)
      .valueChanges().pipe(map(channel => {
        return channel.unreadThread;
      }));
  }

  reduceUnreadCount(uid: string, thread: Thread) {
    if (!thread.unreadCount || !thread.unreadCount[uid]) {
      return;
    }

    const collable = this.fns.httpsCallable('countDown');
    return Promise.all([
      collable({
        path: `channels/${uid}`,
        key: `unreadThread.${thread.status}`,
        value: thread.unreadCount[uid]
      }).toPromise(),
      collable({
        path: `threads/${thread.id}`,
        key: `unreadCount.${uid}`,
        value: thread.unreadCount[uid]
      }).toPromise(),
    ]);
  }

  addReview(targetId, review: Omit<Review, 'createdAt'>): Promise<void> {
    const id = this.db.createId();
    return this.db.doc(`channels/${targetId}/reviews/${id}`).set({
      id,
      createdAt: new Date(),
      ...review,
    });
  }

  getReviews(channelId: string) {
    let tmpReviews;

    return this.db.collection<Review>(`channels/${channelId}/reviews`)
      .valueChanges().pipe(
        switchMap(replies => {
          tmpReviews = replies;
          return forkJoin(
            replies
            .map(reply => reply.authorId)
            .filter((uid, i, self) => self.indexOf(uid) === i)
            .map(uid => {
              return this.db.doc<ChannelMeta>(`channels/${uid}`).valueChanges().pipe(take(1));
            })
          );
        }),
        map(users => {
          return tmpReviews.map(reply => {
            reply.author = users.find(user => user.id === reply.authorId);
            return reply;
          });
        })
      );
  }
}
