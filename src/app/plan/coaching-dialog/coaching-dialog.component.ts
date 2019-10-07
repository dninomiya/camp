import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { Plan } from 'src/app/interfaces/plan';
import { MAT_DATE_LOCALE } from '@angular/material';

import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-coaching-dialog',
  templateUrl: './coaching-dialog.component.html',
  styleUrls: ['./coaching-dialog.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
  ]
})
export class CoachingDialogComponent implements OnInit {

  @Output() data = new EventEmitter();
  @Input() plan: Plan;

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    days: this.fb.array([], [Validators.required])
  });

  get days(): FormArray {
    return this.form.controls.days as FormArray;
  }

  times: string[] = [];
  maxDate = moment().add(1, 'M').toDate();
  minDate = moment().add(1, 'days').toDate();

  constructor(
    private fb: FormBuilder
  ) {
    this.buildControls();
    this.setTimes();
  }

  ngOnInit() { }

  checkUniqueDate(): ValidatorFn {
    return (control: FormControl): {[key: string]: any} | null => {
      const currentDate = control.value && control.value.date();
      const days = this.days.value.map(item => item.date && item.date.date());

      if (days.find(day => day === currentDate)) {
        return {
          unique: {
            value: control.value
          }
        };
      } else {
        return null;
      }
    };
  }

  setTimes() {
    const getData = (i: number): string => {
      const hour = (8 + Math.floor(i / 2)).toString().padStart(2, '0');
      const min = (i % 2 === 0 ? 0 : 30).toString().padStart(2, '0');
      return `${hour}:${min}`;
    };

    [...Array(24)].forEach((_, i) => {
      this.times.push(`${getData(i)} - ${getData(i + 1)}`);
    });
  }

  buildControls() {
    [...Array(3)].forEach(() => {
      this.days.push(this.fb.group({
        date: ['', [Validators.required, this.checkUniqueDate()]],
        allDay: [false],
        time: ['', [Validators.required]]
      }));
    });

    const days: FormArray = this.form.controls.days as FormArray;
    days.controls.forEach(control => {
      control.get('allDay').valueChanges.subscribe(status => {
        if (status) {
          control.get('time').setValue(null);
          control.get('time').disable();
          control.get('time').clearValidators();
        } else {
          control.get('time').enable();
          control.get('time').setValidators(Validators.required);
        }
      });
    });
  }

  submit() {
    this.form.value.days = this.form.value.days.map(day => {
      day.date = day.date.toDate();
      return day;
    });
    this.data.emit(this.form.value);
  }

}
