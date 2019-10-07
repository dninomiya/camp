import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Plan } from 'src/app/interfaces/plan';
import { Validators, FormBuilder } from '@angular/forms';
import { ChannelMeta } from 'src/app/interfaces/channel';

@Component({
  selector: 'app-premium-dialog',
  templateUrl: './premium-dialog.component.html',
  styleUrls: ['./premium-dialog.component.scss']
})
export class PremiumDialogComponent implements OnInit {

  @Output() status = new EventEmitter();
  @Input() plan: Plan;
  @Input() channel: ChannelMeta;

  constructor() { }

  ngOnInit() { }

  submit() {
    this.status.emit(true);
  }

}
