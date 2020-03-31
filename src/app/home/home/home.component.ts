import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  algoliaConfig = {
    ...environment.algolia,
    indexName: environment.algolia.indexName + '-latest'
  };

  latestParams = {
    hitsPerPage: 20,
    filters: 'public:true AND NOT deleted:true'
  };

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
    private titleService: Title
  ) {
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
