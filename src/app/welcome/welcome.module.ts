import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [SharedModule, WelcomeRoutingModule, NgxPageScrollModule]
})
export class WelcomeModule {}
