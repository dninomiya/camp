import { SharedConfirmDialogComponent } from './../../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { map } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PaymentService } from './../../services/payment.service';
import { Observable } from 'rxjs';
import { User, UserPayment } from 'src/app/interfaces/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user$: Observable<User> = this.userService.getUser(
    this.authService.user.id
  );

  loading: boolean;

  customerId: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.paymentService.getUserPayment(
      this.authService.user.id
    ).subscribe(customer => this.customerId = customer && customer.customerId);
  }

  ngOnInit() {
  }

  getDays(from: Date): number {
    return moment().diff(moment(from), 'days');
  }

  getTotalPay(from: Date): number {
    const monthConst = 500000;
    const dayCost = monthConst / 30;
    return Math.round(this.getDays(from) * dayCost);
  }

  getLimitDate(from: Date): Date {
    return moment(from).add(4, 'years').toDate();
  }

  createSubscription() {
    if (this.customerId) {
      this.loading = true;
      this.paymentService.createSubscription(
        this.customerId
      ).then(() => {
        this.snackBar.open('会員登録しました', null, {
          duration: 2000
        });
        this.loading = false;
      });
    } else {
      this.dialog.open(
        CardDialogComponent
      );
    }
  }

  cancellation() {
    if (this.customerId) {
      this.dialog.open(SharedConfirmDialogComponent, {
        restoreFocus: false,
        data: {
          title: '本当に解約しますか？',
          description: '解約するとCAMPから退会となります'
        }
      }).afterClosed().subscribe(status => {
        if (status) {
          this.loading = true;
          this.paymentService.deleteSubscription(
            this.customerId
          ).then(() => {
            this.snackBar.open('解約しました', null, {
              duration: 2000
            });
            this.loading = false;
          });
        }
      });
    }
  }

}
