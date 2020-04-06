import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  algoliaConfig = {
    ...environment.algolia,
    indexName: environment.algolia.indexName + '-latest',
  };

  latestParams = {
    hitsPerPage: 20,
    filters: 'public:true AND NOT deleted:true',
  };

  constructor(private seoService: SeoService, private titleService: Title) {
    this.seoService.setSchema({
      '@type': 'WebSite',
      logo: '/assets/images/logo.png',
      name: environment.title,
      type: 'WebSite',
      potentialAction: {
        '@type': 'SearchAction',
        target: '/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }

  ngOnInit() {
    this.seoService.createCanonicalURL();
    this.titleService.setTitle('CAMP');
  }
}
