import { LessonBody } from './../../interfaces/lesson';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson, LessonMeta } from 'src/app/interfaces/lesson';
import { Observable, combineLatest, Subscription, of, merge } from 'rxjs';
import {
  switchMap,
  tap,
  take,
  shareReplay,
  map,
  catchError,
} from 'rxjs/operators';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { LessonService } from 'src/app/services/lesson.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ListService } from 'src/app/services/list.service';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { SeoService } from 'src/app/services/seo.service';
import { UiService } from 'src/app/services/ui.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import Player from '@vimeo/player';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
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
  lessonId$: Observable<string> = this.route.queryParamMap.pipe(
    map((params) => {
      this.lessonId = params.get('v');
      return this.lessonId;
    }),
    shareReplay(1)
  );

  cause$: Observable<LessonList> = this.route.queryParamMap.pipe(
    switchMap((params) => {
      const causeId = params.get('cause');
      if (causeId) {
        return this.listService.getList(causeId);
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  lessonMeta$: Observable<LessonMeta> = this.lessonId$.pipe(
    switchMap((id) => {
      if (id) {
        return this.lessonService.getLessonMeta(id).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    tap((meta) => {
      if (!meta) {
        this.router.navigate(['not-found']);
        return of(null);
      }
    }),
    shareReplay(1)
  );

  permission$: Observable<boolean> = this.lessonId$.pipe(
    switchMap((id) => this.lessonService.checkPermission(id)),
    shareReplay(1)
  );

  lessonBody$: Observable<LessonBody> = this.permission$.pipe(
    switchMap((permission) => {
      if (permission) {
        return this.getBody();
      } else {
        return of({
          body: '',
        });
      }
    }),
    shareReplay(1)
  );

  user$: Observable<User> = this.authService.authUser$.pipe(
    tap((user) => (this.uid = user && user.id))
  );

  player: Player;

  lesson$: Observable<Lesson> = combineLatest([
    this.lessonMeta$,
    this.lessonBody$,
  ]).pipe(
    map(([meta, body]) => {
      return {
        ...meta,
        ...body,
      };
    }),
    tap(() => {
      setTimeout(() => {
        this.setSeek();
      }, 2000);
    }),
    shareReplay(1)
  );

  isOwner$: Observable<boolean> = combineLatest([
    this.user$,
    this.lessonMeta$,
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

  channel$: Observable<ChannelMeta> = this.lessonMeta$.pipe(
    switchMap((lesson) => {
      if (lesson) {
        return this.channelService.getChannel(lesson.channelId).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    tap((channel) => (this.channel = channel)),
    shareReplay(1)
  );

  viewTimer;
  subs: Subscription;

  constructor(
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private authService: AuthService,
    private listService: ListService,
    private seoService: SeoService,
    private router: Router,
    private uiService: UiService,
    private loadingService: LoadingService
  ) {
    this.lesson$.subscribe((lesson) => {
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
        '@id': '/',
      },
      headline: lesson.title,
      image: [image],
      datePublished: lesson.createdAt.toDate().toISOString(),
      dateModified: lesson.updatedAt
        ? lesson.updatedAt.toDate().toISOString()
        : '',
      author: {
        '@type': 'Person',
        name: channel.title,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Google',
        logo: {
          '@type': 'ImageObject',
          url: 'https://google.com/logo.jpg',
        },
      },
      description: 'A most wonderful article',
      articleBody: lesson.body,
    });
  }

  async setMeta(lesson: Lesson) {
    const image =
      lesson.thumbnailURL || environment.host + '/assets/images/ogp-cover.png';
    this.seoService.generateTags({
      title: lesson.title,
      image,
      type: 'article',
      description: lesson.body
        ? lesson.body.replace(/# -/gm, '').substring(0, 100)
        : '',
      size: lesson.tags.includes('mentor') ? 'summary' : 'summary_large_image',
    });
  }

  generateStackBlitz(lesson: LessonBody, urls: string[]) {
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
    combineLatest([this.permission$, this.lessonMeta$]).subscribe(
      ([permission]) => {
        if (permission) {
          setTimeout(() => {
            (window as any).twttr.widgets.load();
          }, 500);
        }
      }
    );
  }

  private setSeek() {
    const seeks = document.querySelectorAll('.seek');
    this.player =
      document.getElementById('vimeo') &&
      new Player(document.getElementById('vimeo'));
    if (seeks) {
      seeks.forEach((seek) => {
        seek.addEventListener('click', () => {
          const [hour, min, sec] = seek.textContent.split(':');
          if (sec) {
            this.player.setCurrentTime(+hour * 3600 + +min * 60 + +sec);
          } else {
            this.player.setCurrentTime(+hour * 60 + +min);
          }
        });
      });
    }
  }

  private getBody(): Observable<LessonBody> {
    return this.lessonId$.pipe(
      tap(() => this.loadingService.startLoading()),
      switchMap((id) => {
        if (id) {
          return this.lessonService.getLessonBody(id);
        } else {
          return of(null);
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      }),
      switchMap((lessonBody: LessonBody) => {
        if (!lessonBody) {
          return of(null);
        }
        this.countUpView(this.lessonId);

        const matchUrls = lessonBody.body.match(/^http.*$/gm);
        const urlMap = matchUrls
          ? {
              externalUrls: matchUrls.filter((url) => {
                return !url.match(/stackblitz\.com/);
              }),
              stackblitz: matchUrls.filter((url) => {
                return url.match(/stackblitz\.com/);
              }),
            }
          : {};

        if (urlMap.stackblitz) {
          this.generateStackBlitz(lessonBody, urlMap.stackblitz);
        }

        if (urlMap.externalUrls) {
          return merge(
            of(lessonBody),
            this.lessonService.getOGPs(urlMap.externalUrls).pipe(
              map((ogps) => {
                urlMap.externalUrls.forEach((url, i) => {
                  if (ogps[i]) {
                    const reg = new RegExp(
                      `^${url.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}$`,
                      'gm'
                    );
                    lessonBody.body = lessonBody.body.replace(
                      reg,
                      this.getOgpHTML(ogps[i])
                    );
                  }
                });
                return lessonBody;
              })
            )
          );
        } else {
          return of(lessonBody);
        }
      }),
      tap(() => {
        this.loadingService.endLoading();
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          setTimeout(() => {
            document.querySelector('#' + fragment).scrollIntoView();
            window.scrollBy(0, -70);
          }, 1000);
        }
      }),
      shareReplay(1)
    );
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

  ngOnDestroy() {
    clearTimeout(this.viewTimer);
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
