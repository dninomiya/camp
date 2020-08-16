import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IsaService } from './../../services/isa.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-isa-calc',
  templateUrl: './isa-calc.component.html',
  styleUrls: ['./isa-calc.component.scss'],
})
export class IsaCalcComponent implements OnInit {
  constructor(
    public isaService: IsaService,
    @Inject(MAT_DIALOG_DATA) public day: number = 120
  ) {}

  ngOnInit(): void {}
}
