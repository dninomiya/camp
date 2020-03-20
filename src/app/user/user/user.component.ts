import { tap } from 'rxjs/operators';
import { PlanPipe } from './../../shared/plan.pipe';
import { ConfirmUnsubscribeDialogComponent } from './../../core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { SharedConfirmDialogComponent } from './../../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from './../../services/payment.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [PlanPipe]
})
export class UserComponent implements OnInit {
  user$: Observable<User> = this.userService
    .getUser(this.authService.user.id)
    .pipe(tap(user => (this.canceled = user.isCaneclSubscription)));

  loading: boolean;
  canceled: boolean;
  customerId: string;
  dayCost = 16666;
  maxCost = 3000000;
  cancellationInProgress: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private planPipe: PlanPipe
  ) {
    this.paymentService
      .getUserPayment(this.authService.user.id)
      .subscribe(
        customer => (this.customerId = customer && customer.customerId)
      );
  }

  ngOnInit() {}

  getDays(start: number, end: number = Date.now()): number {
    return moment(end).diff(moment(start), 'days');
  }

  getTotalPay(start: number, end: number): number {
    return Math.min(this.getDays(start, end) * this.dayCost, this.maxCost);
  }

  getLimitDate(from: Date): Date {
    return moment(from)
      .add(4, 'years')
      .toDate();
  }

  getPayLimit(end: number) {
    console.log(end);
    return moment(end)
      .add(5, 'years')
      .toDate();
  }

  openUnsubscribeDialog(user: User) {
    this.cancellationInProgress = true;
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '自動更新を停止しますか？',
          description:
            '自動更新を停止すると' +
            formatDate(
              new Date(user.currentPeriodEnd * 1000),
              'yyyy年MM月dd日',
              'ja'
            ) +
            '以降フリープランになります。それまでは引き続き' +
            this.planPipe.transform(user.plan) +
            'プランをご利用いただけます。'
        }
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          this.dialog
            .open(ConfirmUnsubscribeDialogComponent, {
              data: {
                uid: user.id,
                planId: user.plan
              }
            })
            .afterClosed()
            .subscribe(unsubStatus => {
              if (!unsubStatus) {
                this.cancellationInProgress = false;
              }
            });
        } else {
          this.cancellationInProgress = false;
        }
      });
  }
}
