import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PlanDialogComponent } from 'src/app/plan-dialog/plan-dialog.component';
import { Plan } from 'src/app/interfaces/plan';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { PlanActionDialogWrapperComponent } from '../plan-action-dialog-wrapper/plan-action-dialog-wrapper.component';
import { AuthService } from 'src/app/services/auth.service';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  @Input() channel: ChannelMeta;
  @Input() plans: Plan[];
  @Input() isOwner: boolean;

  customerId: string;
  notLogin: boolean;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.checkCustomer();
  }

  checkCustomer() {
    this.authService.authUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.paymentService.getUserPayment(user.id);
        } else {
          this.notLogin = true;
          return of(null);
        }
      })
    ).subscribe(data => {
      this.customerId = data && data.customerId;
    });
  }

  openPlanHelpDialog(plan: Plan, event) {
    event.stopPropagation();
    this.dialog.open(PlanDialogComponent, {
      data: {
        plan,
        channel: this.channel
      },
      restoreFocus: false
    }).afterClosed().subscribe(status => {
      if (status) {
        this.openPlanDialog(plan);
      }
    });
  }

  openPlanDialog(plan: Plan) {
    if (this.customerId) {
      this.dialog.open(PlanActionDialogWrapperComponent, {
        data: {
          plan,
          targetId: this.channel.id,
          authorId: this.authService.user.id,
          sellerEmail: this.channel.email
        },
        width: '800px',
        restoreFocus: false
      }).afterClosed().subscribe(id => {
        if (id) {
          this.snackBar.open('リクエストを作成しました', '開く', {
            duration: 2000
          }).onAction().subscribe(() => {
            this.router.navigate(['/forum', id], {
              queryParams: {
                status: 'request'
              }
            });
          });
        }
      });
    } else if (!this.notLogin && !this.isOwner) {
      this.dialog.open(CardDialogComponent, {
        width: '560px'
      });
    } else if (this.notLogin) {
      this.authService.openLoginDialog();
    }
  }

  ngOnDestroy() {
  }
}
