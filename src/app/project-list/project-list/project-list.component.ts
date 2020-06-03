import { UserService } from 'src/app/services/user.service';
import { ApolloService } from './../../services/apollo.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { ProductWithAuthor } from './../../interfaces/product';
import { Observable, of, combineLatest } from 'rxjs';
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
        }, 0);

        const suHours = repo.amount + Math.round(repo.amount / 56) * 16;

        repo.goal =
          repo.amount &&
          moment()
            .add(suHours / 8, 'days')
            .toDate();
        return repo;
      });
    }),
    map((repos) => {
      return repos
        .filter((repo) => !!repo.amount)
        .sort((a, b) => a.amount - b.amount);
    }),
    switchMap((repos: object[]) => {
      return combineLatest([
        of(repos),
        combineLatest(
          repos.map((repo: any) => this.userService.getUserByRepoId(repo.id))
        ),
      ]);
    }),
    map(([repos, users]) => {
      return repos
        .map((repo, index) => {
          return {
            ...repo,
            user: users[index],
          };
        })
        .map((item: any) => {
          if (item.user?.lastPullRequestDate) {
            item.sleepTime = moment().diff(
              item.user.lastPullRequestDate.toDate(),
              'days'
            );
          }
          return item;
        });
    }),
    tap((res) => {
      this.tableLoading = false;
    })
  );

  displayedColumns = [
    'project',
    'assign',
    'lastPullRequestDate',
    'pullRequest',
    'amount',
    'goal',
  ];

  products$: Observable<
    ProductWithAuthor[]
  > = this.productService
    .getAllProducts()
    .pipe(tap((_) => (this.loading = false)));

  constructor(
    private productService: ProductService,
    private apolloService: ApolloService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
}
