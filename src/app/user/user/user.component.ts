import { RepoSelectorComponent } from './../repo-selector/repo-selector.component';
import { ApolloService } from './../../services/apollo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  githubToken$: Observable<string> = this.authService.getGitHubToken();

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apolloService: ApolloService
  ) {}

  ngOnInit() {}

  isDone(tasks: string[], taskId: string): boolean {
    if (!tasks) return false;
    return !!tasks.find((id) => id === taskId);
  }

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

  connectGitHub() {
    this.authService.connectGitHub().then((result) => {
      this.snackBar.open('GitHubと連携しました');
    });
  }

  connectRepo() {
    this.dialog
      .open(RepoSelectorComponent, {
        width: '640px',
      })
      .afterClosed()
      .subscribe((repoId?: string) => {
        if (repoId) {
          this.authService
            .updateUser({
              repoId,
            })
            .then(() => {
              this.snackBar.open('リポジトリを登録しました！');
            });
        }
      });
  }

  importLabels(repoId: string) {
    this.apolloService.createLabel(repoId).then(() => {
      this.snackBar.open('ラベルを初期化しました');
    });
  }
}
