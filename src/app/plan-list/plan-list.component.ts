import { Ticket } from './../interfaces/ticket';
import { SharedConfirmDialogComponent } from './../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { CardDialogComponent } from './../shared/card-dialog/card-dialog.component';
import { TicketService } from './../services/ticket.service';
import { PLAN_FEATURES } from './../welcome/welcome-data';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { PaymentService } from './../services/stripe/payment.service';
import { PlanService } from './../services/plan.service';
import { PlanDataWithPrice } from './../interfaces/plan';
import { Component, OnInit, Input } from '@angular/core';
import Stripe from 'stripe';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss'],
})
export class PlanListComponent implements OnInit {
  @Input() isEmbed: boolean;

  readonly planFeatures = PLAN_FEATURES;

  plans: PlanDataWithPrice[];
  loading: boolean;
  loginSnackBar: MatSnackBarRef<any>;
  method: Stripe.PaymentMethod;

  constructor(
    public authService: AuthService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private paymentService: PaymentService,
    public ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.getPlans();
    this.getMethod();
  }

  private getMethod() {
    this.paymentService
      .getPaymentMethod()
      .then((method) => (this.method = method));
  }

  private async getPlans() {
    const plans = await this.planService.getPlans();
    const prices = await Promise.all(
      plans.map((plan) => this.paymentService.getPrice(plan.mainPriceId))
    );

    this.plans = plans.map((plan) => {
      return {
        ...plan,
        price: prices.find((price) => price.id === plan.mainPriceId),
      };
    });
  }

  private loginAndAction(action: () => void) {
    if (this.authService.user) {
      action();
    } else {
      this.dialog
        .open(LoginDialogComponent)
        .afterClosed()
        .subscribe((status) => {
          if (status) {
            this.loading = true;
            this.snackBar.open('ログインしています', null, {
              duration: null,
            });
            this.authService
              .login()
              .then(() => {
                this.authService.authUser$.subscribe((user) => {
                  if (user) {
                    action();
                  }
                  this.snackBar.open('ログインしました');
                });
              })
              .catch(() => {
                this.snackBar.open('ログインできませんでした');
                this.loading = false;
              });
          }
        });
    }
  }

  signupPlan(planId: string) {
    this.loginAndAction(() => {
      this.router.navigateByUrl('/signup?planId=' + planId);
    });
  }

  private openTicketDialog(ticket: Ticket) {
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: `${ticket.name}チケットを${formatNumber(
            ticket.amount,
            'ja-JP'
          )}円で購入します`,
          description: ticket.description,
        },
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.snackBar.open('チケットを購入しています...', null, {
            duration: null,
          });
          this.loading = true;
          this.ticketService
            .getTicket(ticket.id, ticket.priceId)
            .then(() => {
              this.snackBar.open('チケットを購入しました!');
            })
            .catch(() => {
              this.snackBar.open('購入できませんでした');
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
  }

  getTicket(ticket: Ticket) {
    this.loginAndAction(() => {
      if (this.method) {
        this.openTicketDialog(ticket);
      } else {
        this.dialog
          .open(CardDialogComponent)
          .afterClosed()
          .subscribe((status) => {
            if (status) {
              this.openTicketDialog(ticket);
            }
          });
      }
    });
  }
}
