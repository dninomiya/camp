import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { StripePrice } from '../interfaces/price';
import { CheckoutService } from '../services/checkout.service';
import { StripeProductService } from '../services/stripe-product.service';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { AuthService } from './../services/auth.service';
import { TicketService } from './../services/ticket.service';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss'],
})
export class PlanListComponent implements OnInit {
  @Input() isEmbed: boolean;

  prices$: Observable<StripePrice[]> = this.stripeProductService.getPrices();
  loading: boolean;
  loginSnackBar: MatSnackBarRef<any>;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private checkoutService: CheckoutService,
    private stripeProductService: StripeProductService,
    public ticketService: TicketService
  ) {}

  ngOnInit(): void {}

  async subscribe(priceId: string) {
    this.checkoutService.addSession(this.authService.user.id, priceId);
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
}
