import { NgModule } from '@angular/core';
import { StudioRoutingModule } from './studio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { AboutComponent } from './about/about.component';
import { ShellModule } from '../shell/shell.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListDeleteDialogComponent } from './list-delete-dialog/list-delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultipleLessonEditDialogComponent } from './multiple-lesson-edit-dialog/multiple-lesson-edit-dialog.component';
import { NgAisModule } from 'angular-instantsearch';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchLessonInputComponent } from './search-lesson-input/search-lesson-input.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { UserListComponent } from './user-list/user-list.component';
import { MatSortModule } from '@angular/material/sort';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PlanManageComponent } from './plan-manage/plan-manage.component';
import { PlanManageShellComponent } from './plan-manage-shell/plan-manage-shell.component';
import { CouponManageComponent } from './coupon-manage/coupon-manage.component';

@NgModule({
  declarations: [
    LessonsComponent,
    ListsComponent,
    AboutComponent,
    DashboardComponent,
    ListDeleteDialogComponent,
    MultipleLessonEditDialogComponent,
    SearchLessonInputComponent,
    ImageDialogComponent,
    UserListComponent,
    UserEditorComponent,
    PlanManageComponent,
    PlanManageShellComponent,
    CouponManageComponent,
  ],
  imports: [
    SharedModule,
    StudioRoutingModule,
    MatSortModule,
    MatSidenavModule,
    NgxPicaModule,
    ShellModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DragDropModule,
    NgAisModule,
    ImageCropperModule,
    MatNativeDateModule,
  ],
  entryComponents: [
    ListDeleteDialogComponent,
    MultipleLessonEditDialogComponent,
    ImageDialogComponent,
  ],
})
export class StudioModule {}
