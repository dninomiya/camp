import { MatDialog } from '@angular/material/dialog';
import { IsaCalcComponent } from './../shared/isa-calc/isa-calc.component';
import { IsaService } from './../services/isa.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-isa',
  templateUrl: './isa.component.html',
  styleUrls: ['./isa.component.scss'],
})
export class IsaComponent implements OnInit {
  constructor(public isaService: IsaService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  openIsaCalc(day: number) {
    this.dialog.open(IsaCalcComponent, {
      restoreFocus: false,
      width: '800px',
      data: day,
    });
  }
}
