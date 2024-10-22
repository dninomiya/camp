import { map, take } from 'rxjs/operators';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { repos, ownRepos, OwnRepos, createLabel } from './gql';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Apollo } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';
import { HttpLink } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  readySource = new ReplaySubject<boolean>(1);
  isReady$: Observable<boolean> = this.readySource.asObservable();
  authInvalid: boolean;

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authService: AuthService
  ) {
    this.authService.getGitHubData().subscribe((data) => {
      this.apollo.removeClient();
      if (data?.github) {
        console.log('set apollo');
        this.initApollo(data.github);
      } else {
        this.authInvalid = true;
        this.readySource.next(true);
      }
    });
  }

  async initApollo(token: string): Promise<void> {
    const http = this.httpLink.create({
      uri: 'https://api.github.com/graphql',
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}` || null)
        .set('Accept', 'application/vnd.github.bane-preview+json'),
    });

    const link = onError(({ networkError }) => {
      const error = networkError as any;
      this.readySource.next(true);
      this.authInvalid = error.status && error.status === 401;
    });

    this.apollo.create({
      link: link.concat(http),
      cache: new InMemoryCache(),
    });

    try {
      await this.getOwnRepos();
      this.authInvalid = false;
      this.readySource.next(true);
    } catch {
      this.authInvalid = true;
      this.readySource.next(true);
    }
  }

  getRepos() {
    return this.apollo
      .query<any>({
        query: repos,
      })
      .pipe(
        map(({ data }) => {
          return data.search.edges.map((item) => item.node);
        })
      );
  }

  getOwnRepos(): Promise<{ id: string; name: string }[]> {
    return this.apollo
      .query<any>({
        query: ownRepos,
      })
      .pipe(
        map((res) => {
          const data = res.data as OwnRepos;
          return data.organization.repositories.nodes;
        })
      )
      .toPromise();
  }

  createLabel(repoId: string): Promise<any> {
    return combineLatest(
      [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 16].map((h) => {
        return this.apollo.mutate({
          mutation: createLabel,
          variables: {
            input: {
              repositoryId: repoId,
              color: 'ddd',
              name: h + 'H',
            },
          },
        });
      })
    )
      .pipe(take(1))
      .toPromise();
  }
}
