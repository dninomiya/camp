import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from 'src/app/interfaces/lesson';
import { Observable, combineLatest, Subscription, of, forkJoin, merge } from 'rxjs';
import { switchMap, tap, take, shareReplay, map } from 'rxjs/operators';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { LessonService } from 'src/app/services/lesson.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { AddListDialogComponent } from 'src/app/core/add-list-dialog/add-list-dialog.component';
import { ListService } from 'src/app/services/list.service';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { PaymentService } from 'src/app/services/payment.service';
import { SharedConfirmDialogComponent } from 'src/app/core/shared-confirm-dialog/shared-confirm-dialog.component';
import { MatSnackBar } from '@angular/material';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {

  lessonURL = location.href;
  uid: string;
  isCause: boolean;
  causeId?: string;
  loading = true;
  lessonId?: string;
  settlementStatus: boolean;
  channel: ChannelMeta;
  cause$: Observable<LessonList> = this.route.queryParamMap.pipe(
    switchMap(params => {
      const causeId = params.get('cause');
      if (causeId) {
        return this.listService.getList(causeId);
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  lesson$: Observable<Lesson> = this.route.queryParamMap.pipe(
    tap(params => {
      this.isLoading = true;
      this.isCause = !!params.get('cause');
      this.causeId = params.get('cause');
      this.lessonId = params.get('v');
    }),
    switchMap((params) => {
      const lid = params.get('v');

      if (lid) {
        return this.lessonService.getLesson(lid).pipe(take(1));
      } else {
        of(null);
      }
    }),
    switchMap((lesson) => {
      if (!lesson) {
        return of(null);
      }

      this.countUpView(lesson.id);

      const matchUrls = lesson.body.match(/^http.*$/gm);
      if (matchUrls) {
        return merge(
          of(lesson),
          this.lessonService.getOGPs(matchUrls).pipe(
              map(ogps => {
                matchUrls.forEach((url, i) => {
                  if (ogps[i]) {
                    lesson.body = lesson.body.replace(url, this.getOgpHTML(ogps[i]));
                  }
                });
                return lesson;
              })
            )
        );
      } else {
        return of(lesson);
      }
    }),
    shareReplay(1)
  );

  getParentCause$ = this.lesson$.pipe(
    switchMap(lesson => this.listService.getPremiumCauseWithLesson(lesson))
  );

  user$: Observable<User> = this.authService.authUser$.pipe(
    take(1),
    tap(user => this.uid = user && user.id)
  );

  isOwner$: Observable<boolean> = forkJoin([
    this.user$,
    this.lesson$.pipe(take(1))
  ]).pipe(
    map(([user, lesson]) => {
      if (user) {
        return user.id === lesson.authorId;
      } else {
        return false;
      }
    }),
    shareReplay(1)
  );

  permission$: Observable<boolean> = this.lesson$.pipe(
    map(lesson => {
      return lesson.premium;
    }),
    switchMap((premium: boolean) => {
      if (premium) {
        return of(false); // TODO: remove
        return this.isOwner$;
      } else {
        return of(true);
      }
    }),
    switchMap(permission => {
      if (permission) {
        return of(true);
      } else {
        return this.cause$;
      }
    }),
    switchMap((cause: boolean | LessonList) => {
      if (cause === true) {
        return of(true);
      } else if (cause) {
        return this.lessonService.checkPermission(
          this.lessonId,
          cause.authorId
        );
      } else {
        return this.lessonService.checkPermission(
          this.lessonId,
        );
      }
    }),
    shareReplay(1)
  );

  channel$: Observable<ChannelMeta> = this.lesson$.pipe(
    switchMap(lesson => {
      if (lesson) {
        return this.channelService.getChannel(lesson.channelId).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    tap(channel => this.channel = channel),
    shareReplay(1)
  );
  followerBuff = 0;
  likeBuff = 0;
  isLoading = true;

  isFollow$: Observable<boolean> = combineLatest([
    this.user$,
    this.channel$
  ]).pipe(
    switchMap(([user, channel]) => {
      if (user) {
        return this.channelService.isFollow(user.id, channel.id);
      } else {
        return of(null);
      }
    }),
    tap(() => {
      this.isLoading = false;
    })
  );

  isLiked$: Observable<boolean> = combineLatest([
    this.user$,
    this.lesson$
  ]).pipe(
    switchMap(([user, lesson]) => {
      if (user) {
        return this.lessonService.isLiked(user.id, lesson.id);
      } else {
        return of(null);
      }
    }),
  );

  viewTimer;

  subs: Subscription;

  constructor(
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private authService: AuthService,
    private dialog: MatDialog,
    private listService: ListService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private seoService: SeoService
  ) {
    this.lesson$.subscribe(lesson => {
      this.setMeta(lesson);
    });

    combineLatest([
      this.lesson$,
      this.channel$
    ]).subscribe(([lesson, channel]) => {
      this.setSchema(lesson, channel);
    });
  }

  async setSchema(lesson: Lesson, channel: ChannelMeta) {
    const image = lesson.videoId ? await this.lessonService.getThumbnail(lesson.videoId) : null;
    this.seoService.setSchema({
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': '/'
      },
      headline: lesson.title,
      image: [image],
      datePublished: lesson.createdAt.toDate().toISOString(),
      dateModified: lesson.updatedAt ? lesson.updatedAt.toDate().toISOString() : '',
      author: {
        '@type': 'Person',
        name: channel.title
      },
       publisher: {
        '@type': 'Organization',
        name: 'Google',
        logo: {
          '@type': 'ImageObject',
          url: 'https://google.com/logo.jpg'
        }
      },
      description: 'A most wonderful article',
      articleBody: lesson.body,
    });
  }

  async setMeta(lesson: Lesson) {
    const image = lesson.videoId ? await this.lessonService.getThumbnail(lesson.videoId) : null;
    this.seoService.generateTags({
      title: lesson.title,
      image,
      type: 'article',
      description: lesson.body.replace(/# -/gm, '')
    });
  }

  private getOgpHTML(ogp: any) {
    const data = ogp.data;
    const thumbnail = data.ogImage ?
    `<figure class="ogp__thumbnail" style="background-image: url(${data.ogImage.url})"></figure>` : '';

    return `<a href="${ogp.requestUrl}" target="_blank" class="ogp">
      ${thumbnail}
      <div class="ogp__body">
        <p class="ogp__title">${data.ogTitle}</p>
        <p class="ogp__description">${data.ogDescription}</p>
        <p class="ogp__url">${ogp.requestUrl}</p>
      </div>
    </a>`;
  }

  ngOnInit() {
    combineLatest([
      this.permission$,
      this.lesson$
    ]).subscribe(([permission]) => {
      if (permission) {
        setTimeout(() => {
          ( window as any).twttr.widgets.load();
        }, 500);
      }
    });
  }

  onLoadMarkdown() {
    ( window as any).twttr.widgets.load();
  }

  /**
   * 10秒後にPVカウント
   * @param lid レッスンID
   */
  private countUpView(lid: string) {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
    }

    this.viewTimer = setTimeout(() => {
      this.lessonService.countUpView(lid);
    }, 10000);
  }

  like(id: string) {
    this.likeBuff++;
    if (this.uid) {
      this.lessonService.like(this.uid, id);
    } else {
      console.log('open dialog');
    }
  }

  unlike(id: string) {
    this.likeBuff--;
    this.lessonService.unlike(this.uid, id);
  }

  follow(cid: string) {
    if (this.uid) {
      this.followerBuff++;
      this.channelService.follow(cid, this.uid);
    }
  }

  unfollow(cid: string) {
    if (this.uid) {
      this.followerBuff--;
      this.channelService.unfollow(cid, this.uid);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.viewTimer);
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  openListDialog(lessonId: string, channelId: string) {
    this.dialog.open(AddListDialogComponent, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        lessonId,
        channelId
      }
    });
  }

  chargeLesson(lesson: Lesson) {
    return this.dialog.open(SharedConfirmDialogComponent, {
      data: {
        title: `「${lesson.title}」レッスンを購入しますか？`,
        description: `返金、返品はできません。`
      }
    }).afterClosed().subscribe(status => {
      if (status) {
        const snackBar = this.snackBar.open('レッスンを購入しています');

        this.settlementStatus = true;

        this.paymentService.createCharge({
          amount: lesson.amount,
          userId: this.authService.user.id,
          channelId: this.channel.id,
          contentId: lesson.id,
          type: 'lesson',
          sellerEmail: this.channel.email,
          title: lesson.title,
          contentPath: `lesson?v=${lesson.id}`,
          lesson
        }).then(() => {
          snackBar.dismiss();
          this.settlementStatus = false;
          this.snackBar.open('レッスンを購入しました', null, {
            duration: 2000
          });
        });
      }
    });
  }
}
