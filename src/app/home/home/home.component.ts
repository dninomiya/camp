import { Component, OnInit } from '@angular/core';
import { TrendService } from 'src/app/services/trend.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Title } from '@angular/platform-browser';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';
import { SearchParameters } from 'angular-instantsearch/instantsearch/instantsearch';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  algoliaConfig = environment.algolia;

  searchParameters = {
    hitsPerPage: 20,
    filters: 'public:true AND NOT deleted:true'
  };

  trendSearchParameters = {
    hitsPerPage: 20,
    filters: 'public:true AND NOT deleted:true AND NOT tags:mentor'
  };

  causes$: Observable<LessonList[]> = this.listService.getLists(
    environment.production ? 'ypPxvg7WBUPkYZDN7ao3VyLs9OL2' : 'rN116cfQyfRfs9CnQ1C4DZSpb8k1'
  );

  hotCamps$ = this.channelService.getCamps(['KkyCChATj4PmkWYD2Ut3S1zH7SI3']);

  noFollow = true;
  isLoading = true;

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
    private authService: AuthService,
    private channelService: ChannelService,
    private seoService: SeoService,
    private loadingService: LoadingService,
    private titleService: Title,
    private listService: ListService
  ) {
    this.loadingService.startLoading();
    this.follows$.subscribe(follows => {
      this.isLoading = false;
      this.loadingService.endLoading();
      if (follows.length) {
        this.noFollow = false;
        const ids = follows.map(id => {
          return `authorId:${id}`;
        }).join(' AND ');
        this.searchParameters.filters = `(${ids}) AND NOT deleted:true`;
      } else {
        this.noFollow = true;
      }
    });

    this.seoService.setSchema({
      '@type': 'WebSite',
      logo: '/assets/images/logo.png',
      name: environment.title,
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
    this.titleService.setTitle('CAMP');
  }
}
