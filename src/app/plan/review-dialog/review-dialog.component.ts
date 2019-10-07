import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Plan } from 'src/app/interfaces/plan';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {

  @Output() data = new EventEmitter();
  @Input() plan: Plan;

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    repository: [''],
  });

  confirm = this.fb.control(null);

  browsers = [
    {
      label: 'Chrome',
      value: 'chrome'
    },
    {
      label: 'Safari',
      value: 'safari'
    },
    {
      label: 'Firefox',
      value: 'firefox'
    },
    {
      label: 'IE11',
      value: 'ie11'
    },
    {
      label: 'Edge',
      value: 'edge'
    },
    {
      label: 'iPhone Safari',
      value: 'iphone-safari'
    },
    {
      label: 'iPad Safari',
      value: 'ipad-safari'
    },
    {
      label: 'Android Chrome',
      value: 'android-chrome'
    }
  ];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  submit() {
    this.data.emit(this.form.value);
  }

}
