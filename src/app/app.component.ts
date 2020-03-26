import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { LogUpdateService } from './services/log-update.service';
import { SeoService } from './services/seo.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  schema$: Observable<object> = this.seoService.schema$;

  constructor(
    private logUpdateService: LogUpdateService,
    private seoService: SeoService,
    @Inject(DOCUMENT) private rootDocument: HTMLDocument
  ) {
    if (!environment.production) {
      this.seoService.addNoIndex();
      this.rootDocument
        .querySelector('[rel=icon')
        .setAttribute('href', 'favicon-dev.svg');
    }
  }
}
