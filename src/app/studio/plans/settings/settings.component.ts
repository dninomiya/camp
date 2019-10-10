import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  accountId$ = this.paymentService.getStirpeAccountId(
    this.authService.user.id
  );

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
  }

}
