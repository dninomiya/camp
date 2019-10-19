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

registerLocaleData(localeJa);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgAisModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ServiceWorkerModule.register('combined-worker.js', { enabled: environment.production }),
  ],
  providers: [LogUpdateService, {provide: LOCALE_ID, useValue: 'ja-JP'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
