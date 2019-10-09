import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConnectService } from 'src/app/services/connect.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {

  @Input() data?: any;
  @Input() type: 'company' | 'individual';

  form = this.fb.group({
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
    phone: ['', Validators.required]
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
      if (this.type === 'individual') {
        this.form.patchValue(this.data.individual);
        this.addressBefore = this.data.individual;
      } else if (this.data.relationship) {
        this.form.patchValue(this.data.relationship.representative);
        this.addressBefore = this.data.relationship.representative;
      }
    }

    this.form.get('phone').valueChanges.subscribe(phone => {
      if (phone.match(/^\+81/)) {
        this.form.get('phone').patchValue(phone.replace('+81', ''), {
          emitEvent: false
        });
      }
    });
  }

  getAddress(data) {
    this.address = data;
  }

  submit() {
    let data;

    const formData = {
      ...this.form.value,
      phone: '+81' + this.form.value.phone
    };

    if (this.type === 'company') {
      data = {
        relationship: {
          representative: {
            ...formData,
            ...this.address.value
          }
        }
      };
    } else {
      data = {
        individual: {
          ...formData,
          ...this.address.value
        }
      };
    }

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
