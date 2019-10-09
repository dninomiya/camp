import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { first, take, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { ConnectService } from 'src/app/services/connect.service';

const TEST_DATA = {
  business_type: 'individual',
  external_account: {
    object: 'bank_account',
    country: 'JP',
    currency: 'jpy',
    account_holder_name: 'afaf',
    account_number: '12121',
    routing_number: '0038101'
  },
  tos_acceptance: {
    ip: '211.18.255.73',
    date: 1570600352
  },
  individual: {
    address_kanji: {
      postal_code: '174-0041',
      state: '東京都',
      city: '板橋区',
      town: '121',
      line1: '121'
    },
    address_kana: {
      postal_code: '174-0041',
      state: '東京都',
      city: '板橋区',
      town: '121',
      line1: '121'
    },
    dob: {
      day: '11',
      month: '11',
      year: '11'
    },
    first_name_kana: '大地',
    first_name_kanji: '大地',
    gender: 'male',
    last_name_kana: '二宮',
    last_name_kanji: '二宮',
    phone: '07043613171'
  }
};

@Component({
  selector: 'app-stripe-account-editor',
  templateUrl: './stripe-account-editor.component.html',
  styleUrls: ['./stripe-account-editor.component.scss']
})
export class StripeAccountEditorComponent implements OnInit {

  loading = true;
  subs = new Subscription();
  form = this.fb.group({
    business_type: ['individual', [
      Validators.required,
      Validators.pattern('individual|company')
    ]],
    tos_acceptance: this.fb.group({
      ip: ['', Validators.required],
    })
  });

  defaultData;

  uid = this.authService.user.id;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private paymentService: PaymentService,
    private connectService: ConnectService
  ) {
    this.getIP();
  }

  ngOnInit() {
    this.connectService.getAccount(this.authService.user.id)
      .pipe(take(1)).subscribe(data => {
        this.defaultData = data;
        this.loading = false;
      });
  }

  setDummyData() {
    this.form.patchValue(TEST_DATA, {
      emitEvent: false
    });
    this.form.markAsDirty();
  }

  private getIP() {
    this.http.jsonp('https://api.ipify.org/?format=jsonp', 'callback')
      .pipe(first())
      .subscribe((res: {ip: string}) => {
        if (res.ip) {
          this.form.get('tos_acceptance.ip').patchValue(res.ip);
        } else {
          this.snackBar.open('IPが取得できませんでした', null, {
            duration: 2000
          });
        }
      });
  }

  get accountType(): string {
    return this.form.get('business_type').value;
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;

      if (this.accountType === 'individual') {
        data.individual.phone = '+81' + data.individual.phone;
      } else {
        data.relationship.representative.phone = '+81' + data.relationship.representative.phone;
      }
      data.tos_acceptance.date = Math.floor(Date.now() / 1000);

      console.log(data);

      const waiting = this.snackBar.open('アカウントを作成しています。');

      this.paymentService.createAccount(data).then(() => {
        waiting.dismiss();
        this.snackBar.open('アカウントを作成しました', null, {
          duration: 2000
        });
      }).catch(error => {
        console.log(error);
        waiting.dismiss();
        this.snackBar.open('エラーが発生しました', null, {
          duration: 2000
        });
      });
    }
  }

}
