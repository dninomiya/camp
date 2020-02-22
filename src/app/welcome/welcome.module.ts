import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';
import { MockComponent } from './mock/mock.component';

@NgModule({
  declarations: [WelcomeComponent, MockComponent],
  imports: [SharedModule, WelcomeRoutingModule]
})
export class WelcomeModule {}
