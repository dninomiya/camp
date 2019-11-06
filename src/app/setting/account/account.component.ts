import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user$: Observable<User> = this.authService.authUser$;
  uidInput: FormControl = new FormControl('', [
    Validators.required,
    this.idValidator()
  ]);

  mailForm = this.fb.group({
    reply: [false],
    purchase: [false],
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.user$.subscribe(user => {
      if (user && user.mailSettings) {
        this.mailForm.patchValue(user.mailSettings);
      }
    });
  }

  ngOnInit() {
  }

  private idValidator(): ValidatorFn {
    return (control: FormControl): {[key: string]: any} | null => {
      const value = control.value;
      return (value && value === this.authService.afUser.displayName) ? null : {id: {value: control.value}};
    };
  }

  deleteAccount() {
    this.authService.deleteMyAccount().then(() => {
      this.snackBar.open('アカウントを削除しました', null, {
        duration: 2000
      });
    });
    this.router.navigateByUrl('/');
  }

  udpateMailSettings(uid: string) {
    this.userService.updateUser(uid, {
      mailSettings: this.mailForm.value
    }).then(() => {
      this.mailForm.markAsPristine();
      this.snackBar.open('メール設定を変更しました', null, {
        duration: 2000
      });
    });
  }
}
