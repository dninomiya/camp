import { combineLatest } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserEditorComponent } from './../user-editor/user-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { PlanData } from './../../interfaces/plan';
import { PlanService } from './../../services/plan.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  plan = new FormControl('plan');
  users$ = this.userService.getUsers();
  displayedColumns: string[] = [
    'name',
    'email',
    'plan',
    'currentPeriodStart',
    'currentPeriodEnd',
    'action',
  ];
  plans: PlanData[];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  counts: { label: string; count: number; trial?: number }[] = [];

  constructor(
    private userService: UserService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.planService.getPlans().then((plans) => (this.plans = plans));
  }

  ngOnInit() {
    this.users$.subscribe((users) => {
      this.counts = [];
      this.counts.push({
        label: 'すべて',
        count: users.length,
      });
      let customer = 0;
      this.plans.concat().forEach((plan) => {
        const hits = users.filter((user) => user.plan === plan.id);
        const count = hits ? hits.length : 0;
        this.counts.push({
          label: plan.name,
          count: hits?.length,
          trial: hits?.filter((hit) => hit.isTrial).length,
        });
        customer += count;
      });
      this.counts.push({
        label: 'ISA',
        count: users.filter((user) => user.plan === 'isa')?.length,
      });
      this.counts.push({
        label: 'カスタマー',
        count: customer,
      });
    });

    combineLatest([this.users$, this.plan.valueChanges]).subscribe(
      ([users, plan]) => {
        const rows = users.filter((user) => {
          if (plan === 'customer') {
            return user.plan && !user.plan.match(/free|admin/);
          }
          return plan ? (user.plan || 'free') === plan : true;
        });
        this.dataSource.data = rows;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        }, 1000);
      }
    );
    this.plan.patchValue('customer');
  }

  openEditor(user: User) {
    this.dialog
      .open(UserEditorComponent, {
        data: user,
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.snackBar.open('更新しました', null, {
            duration: 2000,
          });
        }
      });
  }
}
