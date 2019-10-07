import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Plan } from '../interfaces/plan';
import { ChannelMeta } from '../interfaces/channel';

@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      plan: Plan,
      channel: ChannelMeta
    }
  ) { }

  ngOnInit() {}

  get plan() {
    return this.data.plan;
  }

  get channel() {
    return this.data.channel;
  }
}
