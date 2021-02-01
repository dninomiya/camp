import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user$: Observable<User> = this.authService.authUser$;
  canceled: boolean;
  restartProcessing: boolean;
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
    crop: true,
    size: {
      width: 80,
      height: 80,
    },
  };

  get linkControls(): FormArray {
    return this.profileForm.get('links') as FormArray;
  }

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
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

  updateAvatar(avatarURL: string) {
    this.userService.updateUser(this.authService.user.id, {
      avatarURL,
    });
  }
}
