import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ct-redirect',
  templateUrl: './ct-redirect.component.html',
  styleUrls: ['./ct-redirect.component.scss'],
})
export class CtRedirectComponent implements OnInit {
  constructor() {
    console.log(document.referrer);
    alert(document.referrer);
    // location.href = 'http://localhost:3000/';
  }

  ngOnInit(): void {}
}
