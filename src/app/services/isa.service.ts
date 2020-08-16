import { IsaCalcComponent } from './../shared/isa-calc/isa-calc.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IsaService {
  maxCost = 2000000;
  dayCost = this.maxCost / (30 * 6);
  limitYearCount = 5;

  constructor(private dialog: MatDialog) {}

  getShareLimit(day: number) {
    if (day) {
      return Math.min((day * this.dayCost) / 10000, this.maxCost / 10000);
    } else {
      return 0;
    }
  }

  getTotalCost(day: number, income: number) {
    return Math.min(this.getShareLimit(day), (income / 12) * 0.15 * 36);
  }

  openIsaCalc(day: number) {
    this.dialog.open(IsaCalcComponent, {
      restoreFocus: false,
      width: '800px',
      data: day,
    });
  }
}
