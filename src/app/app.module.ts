import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloModule } from 'apollo-angular';
import { filter } from 'rxjs/operators';
import { Router, Scroll, Event } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgAisModule } from 'angular-instantsearch';
import { CoreModule } from './core/core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogUpdateService } from './services/log-update.service';
import localeJa from '@angular/common/locales/ja';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(localeJa);

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgAisModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    ApolloModule,
    HttpLinkModule,
    HttpClientModule,
  ],
  providers: [
    LogUpdateService,
    { provide: LOCALE_ID, useValue: 'ja-JP' },
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: 'googleTagManagerId', useValue: 'GTM-TVXJ56C' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events
      .pipe(filter((e: Event): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.routerEvent.url === '/atomic') {
          return;
        }
        if (e.position) {
          viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }
}
