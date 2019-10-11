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
    name: ['', Validators.required],
    budget: [''],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
    type: ['', Validators.required],
    style: ['', Validators.required],
  });

  body: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      job: Job,
      channel: ChannelMeta
    },
    private fb: FormBuilder
  ) {
    this.form.valueChanges.subscribe(value => {
      this.body = `はじめまして。${value.name}と申します。%0D%0A` +
      `3MLを見てご相談させていただきました。%0D%0A%0D%0A概要はこちらになります。%0D%0A%0D%0A` +
      `予算: ${value.badge || '不明'}%0D%0A` +
      `納期/契約期間: ${value.dueDate}%0D%0A` +
      `契約形態: ${value.type.join('or')}%0D%0A` +
      `ワークスタイル: ${value.style.join('or')}%0D%0A` +
      `概要:%0D%0A${value.description}%0D%0A%0D%0A` +
      `ご検討の上、ご返信いただければ幸いです。%0D%0A` +
      `何卒、よろしくお願いいたします。`;
    });
  }

  ngOnInit() { }

}
