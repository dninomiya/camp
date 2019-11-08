import { Component, OnInit } from '@angular/core';
import { TrendService } from 'src/app/services/trend.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { LoadingService } from 'src/app/services/loading.service';

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

  trendSearchParameters = {
    hitsPerPage: 10,
    filters: 'NOT deleted:true'
  };

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
    private trendService: TrendService,
    private authService: AuthService,
    private channelService: ChannelService,
    private seoService: SeoService,
    private loadingService: LoadingService
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
        console.log(ids);
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
  }

}
