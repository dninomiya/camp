import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { PlanPer, Plan } from 'src/app/interfaces/plan';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent implements OnInit {
  costs = [
    100,
    500,
    1000,
    1500,
    5000,
    10000,
    25000,
    50000,
    100000,
  ];

  plan: Plan;

  form = this.fb.group({
    type: [{
      value: '',
      disabled: true
    }, Validators.required],
    amount: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.route.params.pipe(
      switchMap(params => {
        return this.planService.getPlan(
          this.authService.user.id,
          params.type
        );
      })
    ).subscribe(plan => {
      this.plan = plan;
      this.form.patchValue(plan);
    });
  }

  ngOnInit() {
  }

  submit() {
    this.planService.updatePlan(
      this.authService.user.id,
      {
        ...this.form.value,
        type: this.plan.type
      }
    ).then(() => {
      this.snackBar.open('プランを更新しました', null, {
        duration: 2000
      });
    }).catch(error => {
      this.snackBar.open(error, null, {
        duration: 2000
      });
    });
  }

}
