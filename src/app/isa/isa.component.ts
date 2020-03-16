import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-isa',
  templateUrl: './isa.component.html',
  styleUrls: ['./isa.component.scss']
})
export class IsaComponent implements OnInit {
  dayCost = 16666;

  constructor() {}

  ngOnInit(): void {}

  getShareLimit(day) {
    if (day) {
      return Math.min(day.value * this.dayCost, 3000000);
    } else {
      return 0;
    }
  }
}
