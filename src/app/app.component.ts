import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SeoService } from './services/seo.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  schema$: Observable<object> = this.seoService.schema$;
  icons = [
    'github',
    'mozilla',
    'stackblitz',
    'stripe',
    'sendgrid',
    'firebase',
    'algolia',
    'qiita',
    'codepen',
    'angular',
    'rxjs',
  ];

  constructor(
    private seoService: SeoService,
    @Inject(DOCUMENT) private rootDocument: HTMLDocument,
    private gtmService: GoogleTagManagerService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    if (!environment.production) {
      this.seoService.addNoIndex();
      this.rootDocument
        .querySelector('[rel=icon]')
        .setAttribute('href', 'favicon.dev.svg');
    }

    this.gtmService.addGtmToDom();

    this.initIcons();
  }

  initIcons() {
    this.icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `assets/images/${icon}.svg`
        )
      );
    });
  }
}
