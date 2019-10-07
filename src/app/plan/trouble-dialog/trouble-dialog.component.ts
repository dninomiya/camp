import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Plan } from 'src/app/interfaces/plan';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-trouble-dialog',
  templateUrl: './trouble-dialog.component.html',
  styleUrls: ['./trouble-dialog.component.scss']
})
export class TroubleDialogComponent implements OnInit {

  @Output() data = new EventEmitter();
  @Input() plan: Plan;

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    repository: [''],
    browsers: [''],
  });

  confirm = this.fb.control(null);

  browsers = [
    'Chrome',
    'Safari',
    'Firefox',
    'IE11',
    'Edge',
    'iPhone Safari',
    'iPad Safari',
    'Android Chrome',
    'Mac',
    'iPad',
    'Windows',
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
