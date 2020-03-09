import { Plan } from 'src/app/interfaces/plan';
import { PlanService } from 'src/app/services/plan.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  plan$: Observable<Plan> = this.route.queryParamMap.pipe(map(queryParamMap => {
    return this.planService.getPlan(queryParamMap.get('planId'));
  }));

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService
  ) { }

  ngOnInit(): void { }
}
