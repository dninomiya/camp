import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  jsonLdSource = new Subject<object>();
  schema$ = this.jsonLdSource.asObservable();

  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private dom
  ) { }

  generateTags(config: {
    type: string;
    title: string;
    description: string;
    image: string;
  }) {
    this.titleService.setTitle(config.title ? `${config.title} | ${environment.title}` : environment.title);
    this.meta.updateTag({ property: 'og:type', content: config.type });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: location.href });
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
  }

  addNoIndex() {
    this.meta.updateTag({ property: 'robots', content: 'noindex' });
  }

  setSchema(schema: object) {
    this.jsonLdSource.next({
      ...schema,
      '@context': 'https://schema.org',
      url: location.href
    });
  }

  createCanonicalURL() {
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', this.dom.URL);
  }
}
