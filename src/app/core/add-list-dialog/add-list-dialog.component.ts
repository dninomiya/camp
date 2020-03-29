import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-list-dialog',
  templateUrl: './add-list-dialog.component.html',
  styleUrls: ['./add-list-dialog.component.scss']
})
export class AddListDialogComponent implements OnInit {
  lists$ = this.listService.getLists(this.data.channelId);

  constructor(
    private listService: ListService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lessonId: string;
      channelId: string;
    }
  ) {}

  ngOnInit() {}

  selectItem(event) {
    const list = event.option.value as LessonList;
    const ids = list.lessonIds;

    if (event.option.selected) {
      ids.push(this.data.lessonId);
      this.listService
        .updateList({
          id: list.id,
          data: {
            lessonIds: ids
          }
        })
        .then(() => {
          this.snackBar.open(`${list.title} に追加しました`, null, {
            duration: 2000
          });
        });
    } else {
      this.listService
        .updateList({
          id: list.id,
          data: {
            lessonIds: ids.filter(id => id !== this.data.lessonId)
          }
        })
        .then(() => {
          this.snackBar.open(`${list.title} から削除しました`, null, {
            duration: 2000
          });
        });
    }
  }
}
