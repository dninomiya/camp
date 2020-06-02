import { AuthService } from 'src/app/services/auth.service';
import { ApolloService } from './../../services/apollo.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { ProductWithAuthor } from './../../interfaces/product';
import { Observable, of } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  loading = true;
  tableLoading = true;

  repos$ = this.apolloService.isReady$.pipe(
    switchMap((ready) => {
      if (ready) {
        return this.apolloService.getRepos();
      } else {
        return of([]);
      }
    }),
    map((repos) => {
      return repos.map((repo) => {
        repo.amount = repo.labels.nodes.reduce((total: number, label) => {
          return (
            total +
            label.issues.nodes.reduce((sum, issue) => {
              if (label.name.match(/(.*)H$/) && issue.state === 'OPEN') {
                const hours = +label.name.match(/(.*)H$/)[1];
                return sum + hours;
              }
              return sum;
            }, 0)
          );
          // if (label.name.match(/(.*)H$/)) {
          //   console.log(label.name);
          //   const hours = +label.name.match(/(.*)H$/)[1];
          //   return total + hours;
          // }
          // return total;
        }, 0);

        repo.goal =
          repo.amount &&
          moment()
            .add(repo.amount + Math.round(repo.amount / 56) * 16, 'h')
            .toDate();
        return repo;
      });
    }),
    tap((res) => {
      this.tableLoading = false;
      console.log(res);
    })
  );

  displayedColumns = ['project', 'assign', 'pullRequest', 'amount', 'goal'];

  products$: Observable<
    ProductWithAuthor[]
  > = this.productService
    .getAllProducts()
    .pipe(tap((_) => (this.loading = false)));

  constructor(
    private productService: ProductService,
    private apolloService: ApolloService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
