import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  to: string;
  item$ = combineLatest([
    this.route.paramMap,
    this.authService.authUser$
  ]).pipe(
    switchMap(([params, user]) => {
      this.to = user.name;
      return this.paymentService.getReceipt(user.id, params.get('id'));
    })
  );

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
  }

}
