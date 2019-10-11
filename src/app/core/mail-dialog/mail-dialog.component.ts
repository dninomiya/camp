import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.scss']
})
export class MailDialogComponent implements OnInit {

  siteKey = environment.captchaKey;
  valid: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public email: string
  ) {

  }

  ngOnInit() {
  }

  resolved() {
    this.valid = true;
  }

}
