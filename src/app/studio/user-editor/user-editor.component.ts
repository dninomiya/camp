import { Ticket } from './../../interfaces/ticket';
import { TicketService } from './../../services/ticket.service';
import { PlanData } from './../../interfaces/plan';
import { firestore } from 'firebase/app';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user.service';
import { PlanService } from 'src/app/services/plan.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
})
export class UserEditorComponent implements OnInit {
  plans: PlanData[];
  form: FormGroup = this.fb.group({
    plan: ['', Validators.required],
    isTrial: [''],
    trialUsed: [''],
    currentPeriodStart: [''],
    currentPeriodEnd: [''],
    point: [0],
    isCaneclSubscription: [''],
    isa: this.fb.group({
      start: [''],
      end: [''],
    }),
  });
  tickets: Ticket[];
  isReady: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private fb: FormBuilder,
    private planService: PlanService,
    private userService: UserService,
    private ticketService: TicketService,
    private dialog: MatDialogRef<UserEditorComponent>
  ) {}

  async ngOnInit() {
    this.plans = await this.planService.getPlans();

    const ticketGroup = this.fb.group(
      this.ticketService.tickets.reduce((obj, value) => {
        obj[value.id] = new FormControl(false);
        return obj;
      }, {})
    );

    this.tickets = this.ticketService.tickets;
    this.form.addControl('ticket', ticketGroup);

    this.form.patchValue({
      ...this.user,
      currentPeriodStart: this.user.currentPeriodStart?.toDate(),
      currentPeriodEnd: this.user.currentPeriodEnd?.toDate(),
      isa: {
        start: this.user.isa?.start?.toDate(),
        end: this.user.isa?.end?.toDate(),
      },
    });

    this.isReady = true;
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
      ticket,
    } = this.form.value;
    this.userService
      .updateUser(this.user.id, {
        plan,
        isTrial,
        trialUsed,
        isCaneclSubscription,
        ticket,
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
