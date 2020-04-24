import { firestore } from 'firebase/app';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user.service';
import { PlanService } from 'src/app/services/plan.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    isTrial: [''],
    trialUsed: [''],
    currentPeriodStart: [''],
    currentPeriodEnd: [''],
    isCaneclSubscription: [''],
    isa: this.fb.group({
      start: [''],
      end: [''],
    }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private fb: FormBuilder,
    private planService: PlanService,
    private userService: UserService,
    private dialog: MatDialogRef<UserEditorComponent>
  ) {}

  ngOnInit(): void {
    this.form.patchValue({
      ...this.user,
      currentPeriodStart: this.user.currentPeriodStart?.toDate(),
      currentPeriodEnd: this.user.currentPeriodEnd?.toDate(),
      isa: {
        start: this.user.isa?.start?.toDate(),
        end: this.user.isa?.end?.toDate(),
      },
    });
  }

  updateUser() {
    const {
      plan,
      isTrial,
      trialUsed,
      currentPeriodStart,
      currentPeriodEnd,
      isCaneclSubscription,
      isa,
    } = this.form.value;
    this.userService
      .updateUser(this.user.id, {
        plan,
        isTrial,
        trialUsed,
        isCaneclSubscription,
        isa: {
          start: isa.start ? firestore.Timestamp.fromDate(isa.start) : null,
          end: isa.end ? firestore.Timestamp.fromDate(isa.end) : null,
        },
        currentPeriodStart: currentPeriodStart
          ? firestore.Timestamp.fromDate(currentPeriodStart)
          : null,
        currentPeriodEnd: currentPeriodEnd
          ? firestore.Timestamp.fromDate(currentPeriodEnd)
          : null,
      })
      .then(() => {
        this.dialog.close(true);
      });
  }
}
