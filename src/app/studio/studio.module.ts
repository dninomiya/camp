import { NgModule } from '@angular/core';
import { StudioRoutingModule } from './studio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { PlansComponent } from './plans/plans.component';
import { AboutComponent } from './about/about.component';
import { ShellModule } from '../shell/shell.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListDeleteDialogComponent } from './list-delete-dialog/list-delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GuideComponent } from './plans/guide/guide.component';
import { PlanDetailComponent } from './plans/plan-detail/plan-detail.component';
import { SettingsComponent } from './plans/settings/settings.component';
import { StripeConnectButtonComponent } from './plans/stripe-connect-button/stripe-connect-button.component';
import { ConfirmDisconnectStripeDialogComponent } from './confirm-disconnect-stripe-dialog/confirm-disconnect-stripe-dialog.component';
import { MultipleLessonEditDialogComponent } from './multiple-lesson-edit-dialog/multiple-lesson-edit-dialog.component';
import { NgAisModule } from 'angular-instantsearch';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchLessonInputComponent } from './search-lesson-input/search-lesson-input.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';

@NgModule({
  declarations: [
    LessonsComponent,
    ListsComponent,
    PlansComponent,
    AboutComponent,
    DashboardComponent,
    ListDeleteDialogComponent,
    GuideComponent,
    PlanDetailComponent,
    SettingsComponent,
    StripeConnectButtonComponent,
    ConfirmDisconnectStripeDialogComponent,
    MultipleLessonEditDialogComponent,
    SearchLessonInputComponent,
    ImageDialogComponent,
  ],
  imports: [
    SharedModule,
    StudioRoutingModule,
    MatSidenavModule,
    NgxPicaModule,
    ShellModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DragDropModule,
    NgAisModule,
    ImageCropperModule
  ],
  entryComponents: [
    ListDeleteDialogComponent,
    ConfirmDisconnectStripeDialogComponent,
    MultipleLessonEditDialogComponent,
    ImageDialogComponent
  ]
})
export class StudioModule {}
