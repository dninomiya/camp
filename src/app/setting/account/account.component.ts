import { PlanData } from './../../interfaces/plan';
import { take } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ConfirmUnsubscribeDialogComponent } from './../../core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { PlanPipe } from './../../shared/plan.pipe';
import { MatDialog } from '@angular/material/dialog';
import { SharedConfirmDialogComponent } from './../../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { PlanService } from './../../services/plan.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  ValidatorFn,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [PlanPipe],
})
export class AccountComponent implements OnInit {
  user$: Observable<User> = this.authService.authUser$;
  canceled: boolean;
  cancellationInProgress: boolean;
  uidInput: FormControl = new FormControl('', [
    Validators.required,
    this.idValidator(),
  ]);

  mailForm = this.fb.group({
    reply: [false],
    purchase: [false],
  });

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    profile: ['', [Validators.required, Validators.maxLength(400)]],
    links: this.fb.array([]),
  });

  avatarOptions = {
    path: `users/${this.authService.user.id}`,
    label: 'プロフィール画像',
    size: {
      width: 80,
      height: 80,
      crop: true,
    },
  };

  plan: PlanData;

  get linkControls(): FormArray {
    return this.profileForm.get('links') as FormArray;
  }

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private planService: PlanService,
    private router: Router,
    private dialog: MatDialog,
    private planPipe: PlanPipe
  ) {
    this.user$.pipe(take(1)).subscribe((user) => {
      this.profileForm.patchValue(user);
      if (!user.links?.length) {
        this.addLink();
      } else {
        user.links.forEach((link) => {
          this.addLink(link);
        });
      }
      if (user && user.mailSettings) {
        this.mailForm.patchValue(user.mailSettings);
      }

      this.planService.getPlan(user.plan).then((plan) => {
        this.plan = plan;
      });
    });
  }

  ngOnInit() {}

  private idValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const value = control.value;
      return value && value === this.authService.afUser.displayName
        ? null
        : { id: { value: control.value } };
    };
  }

  deleteAccount() {
    this.authService.deleteMyAccount().then(() => {
      this.snackBar.open('アカウントを削除しました', null, {
        duration: 2000,
      });
    });
    this.router.navigateByUrl('/');
  }

  addLink(link?: string) {
    this.linkControls.push(
      new FormControl(link, [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/https?:\/\/+/),
      ])
    );
  }

  removeLink(i: number) {
    this.linkControls.removeAt(i);
  }

  updateProfile() {
    this.userService
      .updateUser(this.authService.user.id, this.profileForm.value)
      .then(() => {
        this.snackBar.open('プロフィールを更新しました');
      });
  }

  udpateMailSettings(uid: string) {
    this.userService
      .updateUser(uid, {
        mailSettings: this.mailForm.value,
      })
      .then(() => {
        this.mailForm.markAsPristine();
        this.snackBar.open('メール設定を変更しました', null, {
          duration: 2000,
        });
      });
  }

  openUnsubscribeDialog(user: User) {
    this.cancellationInProgress = true;
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '自動更新を停止しますか？',
          description:
            '自動更新を停止すると' +
            formatDate(
              user.currentPeriodEnd.toMillis(),
              'yyyy年MM月dd日',
              'ja'
            ) +
            '以降フリープランになります。それまでは引き続き' +
            this.planPipe.transform(user.plan) +
            'プランをご利用いただけます。',
        },
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.dialog
            .open(ConfirmUnsubscribeDialogComponent, {
              data: {
                uid: user.id,
                planId: user.plan,
              },
            })
            .afterClosed()
            .subscribe((unsubStatus) => {
              if (!unsubStatus) {
                this.cancellationInProgress = false;
              }
            });
        } else {
          this.cancellationInProgress = false;
        }
      });
  }

  updateAvatar(avatarURL: string) {
    this.userService.updateUser(this.authService.user.id, {
      avatarURL,
    });
  }
}
