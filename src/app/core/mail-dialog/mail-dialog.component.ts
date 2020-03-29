import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.scss']
})
export class MailDialogComponent implements OnInit {
  siteKey = environment.captchaKey;
  valid: boolean;
  title = environment.title;

  constructor(@Inject(MAT_DIALOG_DATA) public email: string) {}

  ngOnInit() {}

  resolved() {
    this.valid = true;
  }
}
