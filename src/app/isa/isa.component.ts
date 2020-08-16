import { IsaService } from './../services/isa.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-isa',
  templateUrl: './isa.component.html',
  styleUrls: ['./isa.component.scss'],
})
export class IsaComponent implements OnInit {
  constructor(public isaService: IsaService) {}

  ngOnInit(): void {}
}
