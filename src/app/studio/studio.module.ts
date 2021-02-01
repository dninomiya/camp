import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { NgAisModule } from 'angular-instantsearch';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { AboutComponent } from './about/about.component';
import { CouponManageComponent } from './coupon-manage/coupon-manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ListDeleteDialogComponent } from './list-delete-dialog/list-delete-dialog.component';
import { ListsComponent } from './lists/lists.component';
import { MultipleLessonEditDialogComponent } from './multiple-lesson-edit-dialog/multiple-lesson-edit-dialog.component';
import { SearchLessonInputComponent } from './search-lesson-input/search-lesson-input.component';
import { StudioRoutingModule } from './studio-routing.module';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { UserListComponent } from './user-list/user-list.component';

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
