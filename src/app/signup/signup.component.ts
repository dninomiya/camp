import { Plan } from 'src/app/interfaces/plan';
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
  // plan$: Observable<Plan> = this.route.paramMap.pipe(map(paramMap => {

  // });

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
