import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as zenginCode from 'zengin-code';
import { startWith, map } from 'rxjs/operators';
import { ConnectService } from 'src/app/services/connect.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

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

@Component({
  selector: 'app-external-account-form',
  templateUrl: './external-account-form.component.html',
  styleUrls: ['./external-account-form.component.scss']
})
export class ExternalAccountFormComponent implements OnInit {
  @Input() type: string;
  @Input() data?: object;

  zenginCodeArray: GinCode[] = Object.values(zenginCode);
  branchOptions: GinCode[] = [];
  bankCode: string;
  branchCode: string;

  form = this.fb.group({
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
  });

  bankNameControl = new FormControl('', Validators.required);
  branchNameControl = new FormControl(
    {value: '', disabled: true},
    [Validators.required]
  );

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
    private connectService: ConnectService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  private toZenkaku(str): string {
    return str.replace(/[A-Za-z]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
  }

  branchValueMapper(code: string) {
    if (code) {
      return zenginCode[this.bankCode].branches[code].name + '支店';
    }
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
    this.form.get('routing_number').patchValue(this.bankCode + code);
  }

  bankValueMapper(code: string) {
    if (code && zenginCode[code]) {
      return zenginCode[code].name;
    }
  }

  submit() {
    this.connectService.updateAccount(
      this.authService.user.id,
      {
        external_account: this.form.value
      }
    ).then(() => {
      this.form.markAsPristine();
      this.snackBar.open('銀行口座を登録しました', null, {
        duration: 2000
      });
    });
  }
}
