import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../services/auth.service';
import { FavoriteService } from './../services/favorite.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  favorites$ = this.favoriteService.getFavorites(this.authService.user.id);

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  removeFavorite(itemId: string) {
    this.favoriteService
      .removeFavorite(this.authService.user.id, itemId)
      .then(() => {
        this.snackBar.open('お気に入りから削除しました');
      });
  }
}
