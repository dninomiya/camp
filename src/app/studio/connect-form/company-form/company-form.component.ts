import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConnectService } from 'src/app/services/connect.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  @Input() data?: any;

  form = this.fb.group({
    name: ['', Validators.required],
    name_kana: ['', Validators.required],
    name_kanji: ['', Validators.required],
    tax_id: ['', Validators.required],
  });

  address: {
    valid: boolean;
    value: any
  };
  addressBefore;

  constructor(
    private fb: FormBuilder,
    private connectService: ConnectService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      this.addressBefore = this.data;
    }
  }

  getAddress(data) {
    this.address = data;
  }

  submit() {
    let data;

    data = {
      relationship: {
        representative: {
          ...this.form.value,
          ...this.address.value
        }
      }
    };

    if (this.address.valid && this.form.valid) {
      this.connectService.updateAccount(
        this.authService.user.id,
        data
      ).then(() => {
        this.form.markAsPristine();
        this.snackBar.open('更新しました', null, {
          duration: 2000
        });
      });
    }
  }

}
