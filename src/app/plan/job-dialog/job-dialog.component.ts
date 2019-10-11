import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Job } from 'src/app/interfaces/job';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss']
})
export class JobDialogComponent implements OnInit {

  styles = ['リモート', '出社'];
  types = ['正社員', '業務委託（月単位）', '業務委託（案件単位）', 'その他'];

  form = this.fb.group({
    budget: [''],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
    type: ['', Validators.required],
    style: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      job: Job,
      channel: ChannelMeta
    },
    private fb: FormBuilder
  ) { }

  ngOnInit() { }

}
