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
import { registerLocaleData } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';

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
  ],
  providers: [
    LogUpdateService,
    { provide: LOCALE_ID, useValue: 'ja-JP' },
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: 'googleTagManagerId', useValue: 'GTM-TVXJ56C' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
