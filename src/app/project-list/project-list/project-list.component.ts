import { FromNowPipe } from './../../shared/pipes/from-now.pipe';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ApolloService } from './../../services/apollo.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { ProductWithAuthor } from './../../interfaces/product';
import { Observable, of, combineLatest } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  providers: [FromNowPipe],
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  loading = true;
  tableLoading = true;
  filter = new FormControl('all');
  data$ = this.apolloService.isReady$.pipe(
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
        .filter((repo) => !!repo.amount && repo.name !== 'template')
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
    }),
    shareReplay(1)
  );

  repos$ = combineLatest([this.data$, this.filter.valueChanges]).pipe(
    map(([repos, filter]) => {
      if (!filter || filter === 'all') {
        return repos;
      }
      if (filter === 'denger') {
        return repos.filter(
          (repo) =>
            this.fromNowPipe.transform(repo.user?.lastPullRequestDate) > 5
        );
      }
      if (filter === 'day') {
        return repos.filter((repo) => repo.user?.plan.match(/mentor$|isa/));
      }
      if (filter === 'week') {
        return repos.filter((repo) => repo.user?.plan === 'mentorLite');
      }
    })
  );

  displayedColumns = [
    'project',
    'assign',
    'lastPullRequestDate',
    'pullRequest',
    'amount',
    'goal',
    'point',
    'mtg',
  ];

  products$: Observable<
    ProductWithAuthor[]
  > = this.productService
    .getAllProducts()
    .pipe(tap((_) => (this.loading = false)));

  constructor(
    private productService: ProductService,
    private apolloService: ApolloService,
    private userService: UserService,
    private fromNowPipe: FromNowPipe
  ) {
    this.filter.valueChanges.subscribe((value) => {
      localStorage.setItem('projectFilter', value);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.filter.patchValue(localStorage.getItem('projectFilter') || 'all', {
      emitEvent: true,
    });
  }
}
