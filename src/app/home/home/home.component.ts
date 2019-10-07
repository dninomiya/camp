import { Component, OnInit } from '@angular/core';
import { TrendService } from 'src/app/services/trend.service';
import { Observable, of } from 'rxjs';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  algoliaConfig = environment.algolia;

  searchParameters = {
    hitsPerPage: 10,
    filters: 'NOT deleted:true'
  };

  isLoading = true;

  lessons$: Observable<LessonMeta[]> = this.trendService.getTrend().pipe(
    tap(() => this.isLoading = false)
  );

  follows$: Observable<string[]> = this.authService.authUser$.pipe(
    switchMap(user => {
      if (user) {
        return this.channelService.getFollows(user.id);
      } else {
        return of([]);
      }
    }),
    map(channels => channels.map(channel => channel.id)),
    shareReplay(1)
  );

  constructor(
    private trendService: TrendService,
    private authService: AuthService,
    private channelService: ChannelService,
    private seoService: SeoService
  ) {
    this.follows$.subscribe(follows => {
      if (follows.length) {
        const ids = follows.map(id => {
          return `authorId:${this.authService.user.id}`;
        }).join(' AND ');
        this.searchParameters.filters = `(${ids}) AND NOT deleted:true`;
      }
    });

    this.seoService.setSchema({
      '@type': 'WebSite',
      logo: '/assets/images/logo.png',
      name: '3ML',
      type: 'WebSite',
      potentialAction: {
        '@type': 'SearchAction',
        target: '/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
  }

  ngOnInit() {
    this.seoService.createCanonicalURL();
  }

}
