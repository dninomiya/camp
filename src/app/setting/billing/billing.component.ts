import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  portalLink: string;

  constructor(public customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomerPortalLink().then((link) => {
      this.portalLink = link;
    });
  }
}
