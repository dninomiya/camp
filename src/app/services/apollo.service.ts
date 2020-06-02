import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { repos, ownRepos, OwnRepos } from './qql';
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
  isReady: boolean;

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authService: AuthService
  ) {
    this.authService.getGitHubToken().subscribe((token) => {
      this.apollo.removeClient();
      this.isReady = !!token;
      if (token) {
        this.initApollo(token);
      }
    });
  }

  async initApollo(token: string) {
    const http = this.httpLink.create({
      uri: 'https://api.github.com/graphql',
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${token}` || null
      ),
    });

    this.apollo.create({
      link: http,
      cache: new InMemoryCache(),
    });
  }

  getRepos(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: repos,
      })
      .valueChanges.pipe(
        switchMap(({ data }) => {
          data;
        })
      );
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
}
