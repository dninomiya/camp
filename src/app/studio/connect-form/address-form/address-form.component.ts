import { Component, OnInit, EventEmitter, OnDestroy, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STATES } from '../../models/states';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit, OnDestroy {

  @Input() data?: any;
  @Output() formChanged = new EventEmitter<{
    valid: boolean;
    value: any;
  }>();

  form = this.fb.group({
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
        Validators.pattern('^[ァ-ンヴーｧ-ﾝﾞﾟ]*$'),
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
  });

  stateOptions = Object.keys(STATES);
  subs = new Subscription();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.subs.add(
      this.form.get('address_kanji.postal_code')
        .valueChanges.subscribe(value => {
          const newData = value.replace('-', '');
          this.form.get('address_kanji.postal_code').patchValue(newData, {
            emitEvent: false
          });
          this.form.get('address_kana.postal_code').patchValue(newData);
        })
    );
    this.subs.add(
      this.form.get('address_kanji.state')
        .valueChanges.subscribe(value => {
          this.form.get('address_kana.state').patchValue(STATES[value]);
        })
    );

    this.subs.add(
      this.form.valueChanges.subscribe(value => {
        this.formChanged.emit({
          valid: this.form.valid,
          value: this.form.value
        });
      })
    );

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
