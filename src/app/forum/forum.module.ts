import { NgModule } from '@angular/core';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumRootComponent } from './forum-root/forum-root.component';
import { OpenComponent } from './open/open.component';
import { CloseComponent } from './close/close.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ThreadComponent } from './thread/thread.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { AddReviewDialogComponent } from './add-review-dialog/add-review-dialog.component';
import { ForumGuideComponent } from './forum-guide/forum-guide.component';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';

@NgModule({
  declarations: [
    ForumRootComponent,
    OpenComponent,
    CloseComponent,
    ThreadComponent,
    ThreadListComponent,
    AddReviewDialogComponent,
    ForumGuideComponent,
    RejectDialogComponent
  ],
  imports: [
    SharedModule,
    MatTabsModule,
    ForumRoutingModule
  ],
  entryComponents: [
    AddReviewDialogComponent,
    RejectDialogComponent
  ]
})
export class ForumModule {}
