import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public task,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  done() {
    this.userService
      .completeTask(this.authService.user.id, this.task.id)
      .then(() => {
        this.snackBar.open('タスクを完了しました！🎉');
      });
  }
}
