import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/interfaces/lesson';
import { Observable, combineLatest, Subscription, of, merge } from 'rxjs';
import {
  switchMap,
  tap,
  take,
  shareReplay,
  map,
  catchError
} from 'rxjs/operators';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from 'src/app/services/seo.service';
import { UiService } from 'src/app/services/ui.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  host = environment.host;
  lessonURL = location.href;
  uid: string;
  loading$ = this.loadingService.isLoading$;
  lessonId?: string;
  settlementStatus: boolean;
  channel: ChannelMeta;
  title = environment.title;
  isMobile = this.uiService.isMobile;
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
      this.loadingService.startLoading();
      this.lessonId = params.get('v');
    }),
    switchMap(params => {
      const lid = params.get('v');
      if (lid) {
        return this.lessonService.getLesson(lid).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    catchError(error => {
      console.error(error);
      return of(null);
    }),
    switchMap(lesson => {
      if (!lesson) {
        this.router.navigate(['not-found']);
        return of(null);
      }

      this.countUpView(lesson.id);

      const matchUrls = lesson.body.match(/^http.*$/gm);

      const urlMap = matchUrls
        ? {
            externalUrls: matchUrls.filter(url => {
              return !url.match(/stackblitz\.com/);
            }),
            stackblitz: matchUrls.filter(url => {
              return url.match(/stackblitz\.com/);
            })
          }
        : {};

      if (urlMap.stackblitz) {
        this.generateStackBlitz(lesson, urlMap.stackblitz);
      }

      if (urlMap.externalUrls) {
        return merge(
          of(lesson),
          this.lessonService.getOGPs(urlMap.externalUrls).pipe(
            map(ogps => {
              urlMap.externalUrls.forEach((url, i) => {
                if (ogps[i]) {
                  const reg = new RegExp(
                    `^${url.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}$`,
                    'gm'
                  );
                  lesson.body = lesson.body.replace(
                    reg,
                    this.getOgpHTML(ogps[i])
                  );
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
    tap(() => {
      this.loadingService.endLoading();
      const fragment = this.route.snapshot.fragment;
      const target = document.querySelector('#' + fragment);
      if (fragment && target) {
        setTimeout(() => {
          document.querySelector('#' + fragment).scrollIntoView();
          window.scrollBy(0, -70);
        }, 100);
      }
    }),
    shareReplay(1)
  );

  getParentCause$ = this.lesson$.pipe(
    switchMap(lesson => this.listService.getPremiumCauseWithLesson(lesson))
  );

  user$: Observable<User> = this.authService.authUser$.pipe(
    tap(user => (this.uid = user && user.id))
  );

  isOwner$: Observable<boolean> = combineLatest([
    this.user$.pipe(),
    this.lesson$.pipe()
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

  permission$: Observable<boolean> = this.lessonService.checkPermission();

  channel$: Observable<ChannelMeta> = this.lesson$.pipe(
    switchMap(lesson => {
      if (lesson) {
        return this.channelService.getChannel(lesson.channelId).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    tap(channel => (this.channel = channel)),
    shareReplay(1)
  );
  followerBuff = 0;
  likeBuff = 0;

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
    })
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
    private seoService: SeoService,
    private router: Router,
    private uiService: UiService,
    private loadingService: LoadingService
  ) {
    this.lesson$.subscribe(lesson => {
      if (lesson) {
        this.setMeta(lesson);
      }
    });

    combineLatest([this.lesson$, this.channel$]).subscribe(
      ([lesson, channel]) => {
        if (lesson && channel) {
          this.setSchema(lesson, channel);
        }
      }
    );
  }

  async setSchema(lesson: Lesson, channel: ChannelMeta) {
    const image = lesson.thumbnailURL;
    this.seoService.setSchema({
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': '/'
      },
      headline: lesson.title,
      image: [image],
      datePublished: lesson.createdAt.toDate().toISOString(),
      dateModified: lesson.updatedAt
        ? lesson.updatedAt.toDate().toISOString()
        : '',
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
      articleBody: lesson.body
    });
  }

  async setMeta(lesson: Lesson) {
    const image =
      lesson.thumbnailURL || environment.host + '/assets/images/ogp-cover.png';
    this.seoService.generateTags({
      title: lesson.title,
      image,
      type: 'article',
      description: lesson.body.replace(/# -/gm, '').substring(0, 100),
      size: lesson.tags.includes('mentor') ? 'summary' : 'summary_large_image'
    });
  }

  generateStackBlitz(lesson: Lesson, urls: string[]) {
    urls.forEach((url, i) => {
      const reg = new RegExp(
        `^${url.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}$`,
        'gm'
      );
      const result = this.isMobile
        ? '[コードを見る](' + url.replace(/\?.*/, '') + ')'
        : '<iframe src="' + url + '"></iframe>';
      lesson.body = lesson.body.replace(reg, result);
    });
  }

  private getOgpHTML(ogp: any) {
    const data = ogp.data;
    let imageURL: string;

    if (data.ogImage && data.ogImage.url) {
      imageURL = data.ogImage.url;
    } else if (data.ogImage && data.ogImage[0]) {
      imageURL = data.ogImage[0].url;
    }

    const title = data.ogTitle.replace(/`/g, '&#096;');
    let thumbnail = '';

    if (imageURL) {
      thumbnail = `<figure class="ogp__thumbnail" style="background-image: url(${imageURL})"></figure>`;
    }

    let description = '';

    if (data.ogDescription) {
      description = `<p class="ogp__description">${data.ogDescription
        .replace(/\n/gm, '')
        .replace(/`/g, '&#096;')}</p>`;
    }

    const result = `<a href="${ogp.requestUrl}" target="_blank" class="ogp">
      ${thumbnail}
      <div class="ogp__body">
        <p class="ogp__title">${title}</p>
        ${description}
        <p class="ogp__url">${ogp.requestUrl}</p>
      </div>
    </a>`
      .replace(/\n|^ +/gm, '')
      .replace(/\n/gm, '');

    return '```ogp_export\n' + result + '\n```';
  }

  ngOnInit() {
    combineLatest([this.permission$, this.lesson$]).subscribe(
      ([permission]) => {
        if (permission) {
          setTimeout(() => {
            (window as any).twttr.widgets.load();
          }, 500);
        }
      }
    );
  }

  onLoadMarkdown() {
    (window as any).twttr.widgets.load();
  }

  /**
   * 10秒後にPVカウント
   * @param lid ポストID
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
    if (this.uid) {
      this.likeBuff++;
      this.lessonService.like(this.uid, id);
    } else {
      this.authService.openLoginDialog();
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
    } else {
      this.authService.openLoginDialog();
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
    if (this.uid) {
      this.dialog.open(AddListDialogComponent, {
        width: '400px',
        autoFocus: false,
        restoreFocus: false,
        data: {
          lessonId,
          channelId
        }
      });
    } else {
      this.authService.openLoginDialog();
    }
  }

  chargeLesson(lesson: Lesson) {
    return this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: `「${lesson.title}」ポストを購入しますか？`,
          description: `返金、返品はできません。`
        }
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          const snackBar = this.snackBar.open('ポストを購入しています');
          this.settlementStatus = true;
          this.paymentService
            .createCharge({
              item: {
                id: lesson.id,
                path: this.router.url,
                title: lesson.title,
                body: lesson.body,
                amount: lesson.amount,
                type: 'lesson'
              },
              sellerUid: lesson.authorId,
              customerUid: this.authService.user.id
            })
            .then(() => {
              this.snackBar.open('ポストを購入しました', null, {
                duration: 2000
              });
            })
            .catch(() => {
              this.snackBar.open('購入できませんでした', null, {
                duration: 2000
              });
            })
            .finally(() => {
              snackBar.dismiss();
              this.settlementStatus = false;
            });
        }
      });
  }
}
