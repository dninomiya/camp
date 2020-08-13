import { PlanService } from './../../services/plan.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-manage-shell',
  templateUrl: './plan-manage-shell.component.html',
  styleUrls: ['./plan-manage-shell.component.scss'],
})
export class PlanManageShellComponent implements OnInit {
  plans$ = this.planService.getPlans();

  constructor(private planService: PlanService) {}

  ngOnInit(): void {}
}
