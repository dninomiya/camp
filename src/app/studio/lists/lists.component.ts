import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import { switchMap, tap, map } from 'rxjs/operators';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { LessonService } from 'src/app/services/lesson.service';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { MatDialog } from '@angular/material/dialog';
import { ListEditDialogComponent } from '../list-edit-dialog/list-edit-dialog.component';
import { ListDeleteDialogComponent } from '../list-delete-dialog/list-delete-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NewListDialogComponent } from 'src/app/editor/new-list-dialog/new-list-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  lists$ = this.authService.authUser$.pipe(
    switchMap(user => this.listService.getLists(user.id)),
    tap(lists => {
      if (lists && lists.length) {
        this.lists = lists;
        if (!this.activeList) {
          this.getLessons(lists[0].id);
        }
      }
    })
  );
  lists: LessonList[];
  activeList: LessonList;
  orderSource = new BehaviorSubject(null);
  order$ = this.orderSource.asObservable();
  order: string[];
  isLessonLoading: boolean;

  lessonIdSource = new Subject<string>();
  lessonId$ = this.lessonIdSource.asObservable();

  lessons$ = combineLatest([
    this.lessonId$.pipe(switchMap(id => {
      return this.lessonService.getLessonsByListId(id);
    })),
    this.order$
  ]).pipe(
    map(([lessons, order]) => {
      if (order) {
        return order.map(id => lessons.find(l => l.id === id));
      } else {
        this.order = lessons.map(l => l.id);
        return lessons;
      }
    }),
    tap(() => {
      this.isLessonLoading = false;
    })
  );

  channelId: string;

  constructor(
    private authService: AuthService,
    private listService: ListService,
    private lessonService: LessonService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.route.parent.params.subscribe(params => {
      this.channelId = params.id;
    });
  }

  ngOnInit() {
  }

  getLessons(lid: string) {
    this.isLessonLoading = true;
    this.activeList = this.lists.find(l => l.id === lid);
    this.lessonIdSource.next(lid);
  }

  openEditDialog(list: LessonList) {
    this.dialog.open(ListEditDialogComponent, {
      data: list,
      maxWidth: 400,
      width: '400px'
    });
  }

  openDeleteDialog(list: LessonList) {
    this.dialog.open(ListDeleteDialogComponent, {
      data: list,
      maxWidth: 400,
      width: '400px'
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.order, event.previousIndex, event.currentIndex);
    this.orderSource.next(this.order);
    this.listService.updateList({
      id: this.activeList.id,
      data: {
        lessonIds: this.order
      }
    });
  }

  openAddListDialog() {
    this.dialog.open(NewListDialogComponent, {
      maxWidth: 600,
      maxHeight: '80vh',
      data: {
        uid: this.channelId
      }
    });
  }

  openLessonDeleteDialog(lesson) {
    this.snackBar.open('本当に削除しますか？', 'はい', {
      duration: 4000
    }).onAction().subscribe(() => {
      this.lessonService.deleteLesson(lesson.id).then(() => {
        this.snackBar.open('レッスンを削除しました。', null, {
          duration: 2000
        });
      });

      this.listService.removeLessonFromList(
        this.lists,
        lesson.id
      );
    });
  }

  removeLessonFromList(lessonId: string) {
    this.listService.removeLessonFromList(
      [this.activeList],
      lessonId
    ).then(() => {
      this.snackBar.open('リストから削除しました', null, {
        duration: 2000
      });
    });
  }
}
