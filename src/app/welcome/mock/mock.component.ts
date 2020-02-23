import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements OnInit {
  mode: string;
  isFloat: boolean;
  animation;
  initialized: boolean;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.initialized = true;
    }, 2000);
  }

  startAnimation() {
    this.animation = setInterval(() => {
      this.isFloat = !this.isFloat;
    }, 1000);
  }

  stopAnimation() {
    clearInterval(this.animation);
  }
}
