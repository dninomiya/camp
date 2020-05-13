import { TaskComponent } from './../task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { firestore } from 'firebase/app';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user$: Observable<User> = this.userService.getUser(this.authService.user.id);
  dayCost = 16666;
  maxCost = 3000000;

  tasks = [
    {
      label: 'Slack参加',
      id: 'slack',
    },
    {
      label: 'GitHub参加',
      id: 'github',
    },
    {
      label: '企画MTG',
      id: 'meeting',
    },
    {
      label: 'チュートリアル',
      id: 'tutorial',
    },
    {
      label: 'プロダクト開発',
      id: 'develop',
    },
    {
      label: 'プロダクトリリース',
      id: 'release',
    },
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  isDone(tasks: string[], taskId: string): boolean {
    if (!tasks) return false;
    return !!tasks.find((id) => id === taskId);
  }

  ngOnInit() {}

  getDays(
    start: firestore.Timestamp,
    end: firestore.Timestamp = firestore.Timestamp.now()
  ): number {
    return moment(end.toMillis()).diff(moment(start.toMillis()), 'days');
  }

  getTotalPay(start: firestore.Timestamp, end: firestore.Timestamp): number {
    return Math.min(this.getDays(start, end) * this.dayCost, this.maxCost);
  }

  getPayLimit(end: firestore.Timestamp) {
    return moment(end.toDate()).add(5, 'years').toDate();
  }

  openTaskDialog(task: object) {
    this.dialog.open(TaskComponent, {
      data: task,
      autoFocus: false,
    });
  }
}
