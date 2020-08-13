import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { PriceWithProduct } from './../../interfaces/price';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Stripe from 'stripe';

@Component({
  selector: 'app-plan-manage',
  templateUrl: './plan-manage.component.html',
  styleUrls: ['./plan-manage.component.scss'],
})
export class PlanManageComponent implements OnInit {
  form: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    productId: ['', [Validators.required]],
    mainPriceId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    features: this.fb.array([]),
  });

  planId: string;

  couponForm: FormGroup = this.fb.group({
    coupon: [''],
  });

  prods: Stripe.Product[];
  prices: PriceWithProduct[];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private planService: PlanService,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe((map) => {
      this.planId = map.get('id');

      if (this.planId) {
        this.planService.getPlan(this.planId).then((plan) => {
          this.form.patchValue(plan);
          this.features.clear();
          plan.features.forEach((feature) => {
            this.addFeature(feature);
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.paymentService.getAllProducts().then((prods) => {
      this.prods = prods;
    });

    this.paymentService.getAllPrices().then((prices) => {
      this.prices = prices;
    });
  }

  get features(): FormArray {
    return this.form.get('features') as FormArray;
  }

  addFeature(feature?: string) {
    this.features.push(new FormControl(feature, [Validators.required]));
  }

  removeFeature(i: number) {
    this.features.removeAt(i);
  }

  save() {
    this.planService.savePlan(this.form.value);
  }
}
