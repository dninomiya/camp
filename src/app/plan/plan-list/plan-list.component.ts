import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PlanDialogComponent } from 'src/app/plan-dialog/plan-dialog.component';
import { Plan } from 'src/app/interfaces/plan';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { PlanActionDialogWrapperComponent } from '../plan-action-dialog-wrapper/plan-action-dialog-wrapper.component';
import { PlanService } from 'src/app/services/plan.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, of } from 'rxjs';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { Router } from '@angular/router';
import { ChannelReviewDialogComponent } from 'src/app/core/channel-review-dialog/channel-review-dialog.component';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  @Input() channel: ChannelMeta;
  @Output() loaded = new EventEmitter<boolean>();

  plans$;
  customerId: string;
  subs = new Subscription();
  rate: number;

  constructor(
    private dialog: MatDialog,
    private planService: PlanService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.subs.add(
      this.authService.authUser$.pipe(
        switchMap(user => {
          if (user) {
            return this.paymentService.getUserPayment(user.id);
          } else {
            return of(null);
          }
        })
      ).subscribe(data => {
        this.customerId = data && data.customerId;
      })
    );
  }

  ngOnInit() {
    this.plans$ = this.planService.getPlansByChannelId(
      this.channel.id
    ).pipe(
      map(plans => plans.filter(plan => plan.active)),
      tap(() => this.loaded.emit(true))
    );

    this.rate = this.getRate();
  }

  getRate(): number {
    if (this.channel.totalRate && this.channel.totalRate) {
      return this.channel.totalRate / this.channel.reviewCount;
    } else {
      return 0;
    }
  }

  openPlanHelpDialog(plan: Plan, event) {
    event.stopPropagation();
    this.dialog.open(PlanDialogComponent, {
      data: {
        plan,
        channel: this.channel
      },
      restoreFocus: false
    });
  }

  openPlanDialog(plan: Plan) {
    if (this.customerId) {
      this.dialog.open(PlanActionDialogWrapperComponent, {
        data: {
          plan,
          targetId: this.channel.id,
          authorId: this.authService.user.id
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
    } else {
      this.dialog.open(CardDialogComponent, {
        width: '560px'
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  openReviewDialog() {
    this.dialog.open(ChannelReviewDialogComponent, {
      width: '640px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        channel: this.channel,
        rate: this.rate
      }
    });
  }

}
