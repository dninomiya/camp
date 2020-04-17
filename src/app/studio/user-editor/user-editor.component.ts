import { PlanService } from 'src/app/services/plan.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
})
export class UserEditorComponent implements OnInit {
  plans = this.planService.plans;

  form: FormGroup = this.fb.group({
    plan: ['', Validators.required],
    isTrial: ['', Validators.required],
    trialUsed: ['', Validators.required],
    currentPeriodStart: ['', Validators.required],
    currentPeriodEnd: ['', Validators.required],
    isCaneclSubscription: ['', Validators.required],
    isa: this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private fb: FormBuilder,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.user);
  }
}
