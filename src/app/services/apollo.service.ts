import { map, switchMap, tap, take } from 'rxjs/operators';
import { Observable, Subject, of, ReplaySubject, combineLatest } from 'rxjs';
import { repos, ownRepos, OwnRepos, createLabel } from './gql';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Apollo } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';
import { HttpLink } from 'apollo-angular-link-http';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  readySource = new ReplaySubject<boolean>(1);
  isReady$: Observable<boolean> = this.readySource.asObservable();
  repos;

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authService: AuthService
  ) {
    this.authService.getGitHubToken().subscribe((token) => {
      this.apollo.removeClient();
      if (token) {
        console.log('set apollo');
        this.initApollo(token).then(() => {
          this.readySource.next(!!token);
        });
      }
    });
  }

  async initApollo(token: string) {
    const http = this.httpLink.create({
      uri: 'https://api.github.com/graphql',
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}` || null)
        .set('Accept', 'application/vnd.github.bane-preview+json'),
    });

    this.apollo.create({
      link: http,
      cache: new InMemoryCache(),
    });
  }

  getRepos() {
    if (this.repos) {
      return of(this.repos);
    } else {
      return this.apollo
        .watchQuery<any>({
          query: repos,
        })
        .valueChanges.pipe(
          map(({ data }) => {
            return data.organization.repositories.edges.map(
              (iteme) => iteme.node
            );
          }),
          tap((result) => {
            this.repos = result;
          })
        );
    }
  }

  getOwnRepos(): Observable<{ id: string; name: string }[]> {
    return this.apollo
      .watchQuery<any>({
        query: ownRepos,
      })
      .valueChanges.pipe(
        map((res) => {
          const data = res.data as OwnRepos;
          return data.organization.repositories.nodes;
        })
      );
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
