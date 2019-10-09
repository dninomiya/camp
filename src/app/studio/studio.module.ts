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
import { ListEditDialogComponent } from './list-edit-dialog/list-edit-dialog.component';
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
import { SearchLessonInputComponent } from './search-lesson-input/search-lesson-input.component';
import { StripeAccountEditorComponent } from './stripe-account-editor/stripe-account-editor.component';

@NgModule({
  declarations: [
    LessonsComponent,
    ListsComponent,
    PlansComponent,
    AboutComponent,
    DashboardComponent,
    ListEditDialogComponent,
    ListDeleteDialogComponent,
    GuideComponent,
    PlanDetailComponent,
    SettingsComponent,
    StripeConnectButtonComponent,
    ConfirmDisconnectStripeDialogComponent,
    MultipleLessonEditDialogComponent,
    SearchLessonInputComponent,
    StripeAccountEditorComponent
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
    NgAisModule
  ],
  entryComponents: [
    ListEditDialogComponent,
    ListDeleteDialogComponent,
    ConfirmDisconnectStripeDialogComponent,
    MultipleLessonEditDialogComponent
  ]
})
export class StudioModule {}
