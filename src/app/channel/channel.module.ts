import { NgModule } from '@angular/core';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { LessonsComponent } from './lessons/lessons.component';
import { MemberComponent } from './member/member.component';
import { AboutComponent } from './about/about.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RecaptchaModule } from 'ng-recaptcha';
import { ListsComponent } from './lists/lists.component';
import { LinkIconPipe } from './link-icon.pipe';
import { ConfirmSubscribeDialogComponent } from './confirm-subscribe-dialog/confirm-subscribe-dialog.component';
import { PlansComponent } from './plans/plans.component';
import { PlanModule } from '../plan/plan.module';

@NgModule({
  declarations: [
    ChannelDetailComponent,
    LessonsComponent,
    MemberComponent,
    AboutComponent,
    ListsComponent,
    LinkIconPipe,
    ConfirmSubscribeDialogComponent,
    PlansComponent,
  ],
  imports: [
    SharedModule,
    ChannelRoutingModule,
    MatTabsModule,
    MatDialogModule,
    RecaptchaModule,
    PlanModule
  ],
  entryComponents: [
    ConfirmSubscribeDialogComponent
  ]
})
export class ChannelModule {}
