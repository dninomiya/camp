import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import * as zenginCode from 'zengin-code';
import { startWith, map, first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { STATES } from '../models/states';
import { Subscription } from 'rxjs';

interface GinCode {
  code: string;
  name: string;
  kana: string;
  hira: string;
  roma: string;
  branches?: {
    code: string;
    name: string;
    kana: string;
    hira: string;
    roma: string;
  };
}

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

  subs = new Subscription();
  zenginCodeArray: GinCode[] = Object.values(zenginCode);
  accountForm = this.fb.group({
    business_type: ['', [
      Validators.required,
      Validators.pattern(/individual|company/)
    ]],
    external_account: this.fb.group({
      object: ['bank_account', Validators.required],
      country: ['JP', Validators.required],
      currency: ['jpy', Validators.required],
      account_holder_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40)
      ]],
      account_number: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(7)
      ]],
      routing_number: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(11),
        Validators.pattern('^[0-9]*$')
      ]],
    }),
    tos_acceptance: this.fb.group({
      ip: ['', Validators.required],
    })
  });

  stateOptions = Object.keys(STATES);
  accountDetailForm: FormGroup;

  bankNameControl = new FormControl('', Validators.required);
  branchNameControl = new FormControl(
    {value: '', disabled: true},
    [Validators.required]
  );

  branchOptions: GinCode[] = [];
  bankCode: string;
  branchCode: string;
  type: 'individual' | 'company';
  uid = this.authService.user.id;
  filteredBankOptions$ = this.bankNameControl.valueChanges.pipe(
    startWith(''),
    map((name: string) => {
      if (name) {
        name = this.toZenkaku(name.toLocaleUpperCase());
        return this.zenginCodeArray.filter(bank => {
          return bank.name.match(name);
        });
      } else {
        return [];
      }
    })
  );

  filteredBranchOptions$ = this.branchNameControl.valueChanges.pipe(
    startWith(''),
    map((name: string) => {
      if (name) {
        return this.branchOptions.filter(branch => {
          return branch.name.match(name);
        });
      } else {
        return this.branchOptions;
      }
    })
  );

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private paymentService: PaymentService
  ) {
    this.getIP();

    this.accountForm.get('business_type').valueChanges
      .subscribe((type: 'individual' | 'company') => {
        this.buildDetailForm(type);
      });
  }

  ngOnInit() {
    this.setDummyData();
  }

  setDummyData() {
    this.accountForm.get('business_type').patchValue('individual');
    this.accountForm.patchValue(TEST_DATA, {
      emitEvent: false
    });
    this.accountForm.markAsDirty();
    this.accountDetailForm.patchValue(TEST_DATA, {
      emitEvent: false
    });
    this.accountDetailForm.markAsDirty();
  }

  private getIP() {
    this.http.jsonp('https://api.ipify.org/?format=jsonp', 'callback')
      .pipe(first())
      .subscribe((res: {ip: string}) => {
        if (res.ip) {
          this.accountForm.get('tos_acceptance.ip').patchValue(res.ip);
        } else {
          this.snackBar.open('IPが取得できませんでした', null, {
            duration: 2000
          });
        }
      });
  }

  bankValueMapper(code: string) {
    if (code && zenginCode[code]) {
      return zenginCode[code].name;
    }
  }

  get accountType(): string {
    return this.accountForm.get('business_type').value;
  }

  branchValueMapper(code: string) {
    if (code) {
      return zenginCode[this.bankCode].branches[code].name + '支店';
    }
  }

  private toZenkaku(str): string {
    return str.replace(/[A-Za-z]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
  }

  selectedBank(event) {
    const code = event.option.value;
    this.bankCode = code;
    const branches = zenginCode[code].branches;
    if (branches) {
      this.branchOptions = Object.values(branches);
      this.branchNameControl.enable();
    }
  }

  selectedBranch(event) {
    const code = event.option.value;
    this.accountForm.get('external_account.routing_number').patchValue(this.bankCode + code);
  }

  private buildDetailForm(type: 'individual' | 'company') {
    const group: any = {};
    console.log(this.subs);
    this.subs.unsubscribe();
    this.subs = new Subscription();
    console.log(this.subs);

    const address = {
      address_kanji: this.fb.group({
        postal_code: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(7),
        ]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        town: ['', Validators.required],
        line1: ['', Validators.required],
      }),
      address_kana: this.fb.group({
        postal_code: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(7),
        ]],
        state: ['', [
          Validators.required,
          Validators.pattern('^[ァ-ン]*$'),
        ]],
        city: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ0-9０-９\-]*$'),
        ]],
        town: ['', [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ0-9０-９\-]*$'),
        ]],
        line1: ['', [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ0-9０-９\-]*$'),
        ]],
      })
    };

    // this.subs = address.address_kanji.get('state').valueChanges.subscribe(res => {
    //   console.log('check');
    //   // address.address_kana.get('state').patchValue(STATES[res]);
    // });

    const person = {
      dob: this.fb.group({
        day: ['', Validators.required],
        month: ['', Validators.required],
        year: ['', Validators.required],
      }),
      gender: ['', [
        Validators.required,
        Validators.pattern('^(male|female)$'),
      ]],
      first_name_kanji: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      last_name_kanji: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      first_name_kana: ['', [
        Validators.required,
        Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ0-9０-９\-]*$'),
        Validators.maxLength(20)
      ]],
      last_name_kana: ['', [
        Validators.required,
        Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ0-9０-９\-]*$'),
        Validators.maxLength(20)
      ]],
    };

    if (type === 'individual') {
      group.individual = this.fb.group({
        ...address,
        ...person,
        phone: ['', Validators.required]
      });

      this.accountForm.addControl('individual', group.individual);
      this.accountForm.removeControl('company');
      this.accountForm.removeControl('relationship');
    } else if (type === 'company') {
      group.company = this.fb.group({
        ...address,
        name: ['', Validators.required],
        name_kana: ['', Validators.required],
        name_kanji: ['', Validators.required],
        tax_id: ['', Validators.required],
      });

      group.relationship = this.fb.group({
        representative: this.fb.group({
          ...person,
          ...address,
          phone: ['', Validators.required]
        })
      });

      this.accountForm.removeControl('individual');
      this.accountForm.addControl('company', group.company);
      this.accountForm.addControl('relationship', group.relationship);
    }

    this.accountDetailForm = this.fb.group(group);
    this.type = type;
  }

  submit() {
    if (this.accountForm.valid && this.accountDetailForm.valid) {
      const data = {
        ...this.accountForm.value,
        ...this.accountDetailForm.value
      };

      if (this.type === 'individual') {
        data.individual.phone = '+81' + data.individual.phone;
        data.individual.address_kana.state = STATES[data.individual.address_kanji.state];
      } else {
        data.relationship.representative.phone = '+81' + data.relationship.representative.phone;
        data.company.address_kana.state = STATES[data.company.address_kanji.state];
      }

      console.log(data);

      data.tos_acceptance.date = Math.floor(Date.now() / 1000);

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
