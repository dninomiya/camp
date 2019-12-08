import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-delete-dialog',
  templateUrl: './list-delete-dialog.component.html',
  styleUrls: ['./list-delete-dialog.component.scss']
})
export class ListDeleteDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public list: LessonList,
    private listService: ListService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  delete() {
    this.listService.deleteList(
      this.authService.user.id,
      this.list.id
    ).then(() => {
      this.snackBar.open('リストを削除しました', null, {
        duration: 2000
      });
    });
  }

}
