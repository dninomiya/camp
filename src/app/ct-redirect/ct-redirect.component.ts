import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ct-redirect',
  templateUrl: './ct-redirect.component.html',
  styleUrls: ['./ct-redirect.component.scss'],
})
export class CtRedirectComponent implements OnInit {
  constructor() {
    location.href = 'http://localhost:3000/';
    alert(document.referrer);
  }

  ngOnInit(): void {}
}
