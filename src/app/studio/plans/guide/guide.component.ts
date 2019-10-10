import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  accountId$ = this.paymentService.getStirpeAccountId(
    this.authService.user.id
  ).pipe(tap(() => this.isLoading = false));

  isLoading = true;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    console.log('object');
  }

  ngOnInit() {
  }

}
