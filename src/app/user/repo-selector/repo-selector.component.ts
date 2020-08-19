import { AuthService } from 'src/app/services/auth.service';
import { ApolloService } from './../../services/apollo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss'],
})
export class RepoSelectorComponent implements OnInit {
  repos$ = this.apolloService.getOwnRepos();
  selected: string;

  constructor(
    private apolloService: ApolloService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selected = this.authService.user.repoId;
  }
}
