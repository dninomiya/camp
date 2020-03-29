import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';
import { MockComponent } from './mock/mock.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

@NgModule({
  declarations: [WelcomeComponent, MockComponent],
  imports: [
    SharedModule,
    WelcomeRoutingModule,
    NgxYoutubePlayerModule.forRoot(),
    NgxUsefulSwiperModule
  ]
})
export class WelcomeModule {}
