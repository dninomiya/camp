import { Component, OnInit } from '@angular/core';
import { LessonService } from 'src/app/services/lesson.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take, map, shareReplay } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SharedConfirmDialogComponent } from 'src/app/core/shared-confirm-dialog/shared-confirm-dialog.component';
import { MultipleLessonEditDialogComponent } from '../multiple-lesson-edit-dialog/multiple-lesson-edit-dialog.component';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';

import * as algoliasearch from 'algoliasearch/lite';

interface LessonListWithCheckStatus extends LessonList {
  indeterminate: boolean;
  status: boolean;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  algoliaConfig = environment.algolia;
  searchParameters = {
    hitsPerPage: 10,
    page: 0,
    filters: `(authorId:${this.authService.user.id}) AND NOT deleted:true`
  };
  causeOptions: {
    [key: string]: LessonListWithCheckStatus;
  } = {};
  causeForm = new FormArray([]);
  causes$: Observable<LessonList[]> = this.route.parent.params.pipe(
    switchMap(({ id }) => {
      return this.listService.getLists(id).pipe(take(1));
    }),
    shareReplay(1)
  );
  causeOptions$: Observable<LessonListWithCheckStatus[]>;
  lessons$ = this.route.parent.params.pipe(
    switchMap(({ id }) => this.lessonService.getLessonsByChannelId(id))
  );
  displayedColumns: string[] = [
    'select',
    'title',
    'private',
    'createdAt',
    'viewCount',
    'action'
  ];
  dataSource: LessonMeta[];
  selection = new SelectionModel<LessonMeta>(true, []);
  channel$ = this.authService.authUser$.pipe(
    switchMap(user => this.channelService.getChannel(user.id))
  );

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private authService: AuthService,
    private channelService: ChannelService,
    private paginator: MatPaginatorIntl,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private listService: ListService
  ) {
    this.paginator.itemsPerPageLabel = '1 ページあたりの行数';
    this.paginator.nextPageLabel = '次のページへ';
    this.paginator.previousPageLabel = '次のページへ';
    this.paginator.lastPageLabel = '最後のページへ';
    this.paginator.firstPageLabel = '先頭のページへ';
    this.paginator.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 of ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1}～${endIndex} / 合計 ${length}`;
    };
  }

  get causeControls() {
    return this.causeForm.controls;
  }

  ngOnInit() {}

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.length;
      return numSelected === numRows;
    }
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach(row => this.selection.select(row));
  }

  changePager(event) {
    this.searchParameters.page = event.pageIndex;
    this.searchParameters.hitsPerPage = event.pageSize;
  }

  deleteLesson(lessonId: string) {
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '本当に削除しますか？',
          description: '削除すると復元できません'
        },
        restoreFocus: false,
        autoFocus: false
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          const processing = this.snackBar.open('動画を削除しています。');

          this.lessonService.deleteLesson(lessonId);

          processing.dismiss();
          this.snackBar.open('動画を削除しました', null, {
            duration: 2000
          });
        }
      });
  }

  deleteLessons() {
    const lessonIds = this.selection.selected.map(lesson => {
      return lesson.id;
    });
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '本当に削除しますか？',
          description: `${lessonIds.length}件のポストを削除しようとしています。削除すると復元できません`
        },
        restoreFocus: false,
        autoFocus: false
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          const processing = this.snackBar.open(
            `${lessonIds.length}件のポストを削除しています。`
          );

          Promise.all(
            lessonIds.map(id => {
              this.lessonService.deleteLesson(id);
            })
          ).then(() => {
            processing.dismiss();
            this.snackBar.open(
              `${lessonIds.length}件のポストを削除しました`,
              null,
              {
                duration: 2000
              }
            );
          });
        }
      });
  }

  openMultipleEditor() {
    const lessonIds = this.selection.selected.map(lesson => {
      return lesson.id;
    });
    this.dialog
      .open(MultipleLessonEditDialogComponent, {
        restoreFocus: false,
        width: '800px',
        data: lessonIds.length
      })
      .afterClosed()
      .subscribe((data: { free: boolean }) => {
        if (data) {
          const processing = this.snackBar.open('一括編集を開始します', null, {
            duration: 2000
          });

          Promise.all(
            lessonIds.map(id => {
              return this.lessonService.updateLesson(id, data);
            })
          ).then(() => {
            processing.dismiss();

            this.snackBar.open('一括編集が完了しました', null, {
              duration: 2000
            });
          });
        }
      });
  }

  togglePublic(isPublic: boolean) {
    const label = isPublic ? '公開' : '非公開';
    const lessonIds = this.selection.selected.map(lesson => {
      return lesson.id;
    });
    const length = lessonIds.length;

    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: `${length}件のポストを${label}にしますか？`,
          description: `${length}件のポストを${label}にしようとしています。`
        },
        restoreFocus: false,
        autoFocus: false
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          const processing = this.snackBar.open(
            `${length}件のポストを${label}にしています。`
          );

          Promise.all(
            lessonIds.map(id => {
              this.lessonService.updateLesson(id, {
                public: isPublic
              });
            })
          ).then(() => {
            processing.dismiss();
            this.snackBar.open(
              `${length}件のポストを${label}にしました`,
              null,
              {
                duration: 2000
              }
            );
          });
        }
      });
  }

  onenCouseSelector() {
    this.causeOptions$ = this.causes$.pipe(
      map(causes => {
        const totalCount = this.selection.selected.length;
        return causes.map((cause: LessonListWithCheckStatus, i) => {
          let hitCount = 0;
          let status: boolean;

          this.selection.selected.forEach(lesson => {
            hitCount += cause.lessonIds.includes(lesson.id) ? 1 : 0;
          });

          if (totalCount === hitCount) {
            status = true;
            cause.indeterminate = false;
          } else if (hitCount) {
            status = null;
            cause.indeterminate = true;
          } else {
            status = false;
            cause.indeterminate = false;
          }

          this.causeOptions[cause.id] = {
            ...cause,
            status
          };

          return cause;
        });
      })
    );
  }

  updateCauses() {
    const lessons = this.selection.selected;
    Promise.all(
      Object.values(this.causeOptions).map(cause => {
        if (cause.status) {
          lessons.forEach(lesson => {
            if (!cause.lessonIds.includes(lesson.id)) {
              cause.lessonIds.push(lesson.id);
            }
          });
        } else if (cause.status === false) {
          lessons.forEach(lesson => {
            if (cause.lessonIds.includes(lesson.id)) {
              const index = cause.lessonIds.indexOf(lesson.id);
              cause.lessonIds.splice(index, 1);
            }
          });
        }

        if (cause.status !== null) {
          return this.listService.updateList({
            id: cause.id,
            data: {
              lessonIds: cause.lessonIds
            }
          });
        }
      })
    ).then(() => {
      this.snackBar.open('コースを更新しました', null, {
        duration: 2000
      });
    });
  }
}
