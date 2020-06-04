import { switchMap, map } from 'rxjs/operators';
import { LessonMeta } from './../interfaces/lesson';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  addFavorite(uid: string, lessonId: string): Promise<void> {
    return this.db.doc(`users/${uid}/favorites/${lessonId}`).set({
      lessonId,
    });
  }

  removeFavorite(uid: string, lessonId: string): Promise<void> {
    return this.db.doc(`users/${uid}/favorites/${lessonId}`).delete();
  }

  getFavorites(uid: string): Observable<LessonMeta[]> {
    return this.db
      .collection<{ lessonId: string }>(`users/${uid}/favorites`)
      .valueChanges()
      .pipe(
        switchMap((docs) => {
          return combineLatest(
            docs.map((doc) => {
              return this.db
                .doc<LessonMeta>(`lessons/${doc.lessonId}`)
                .valueChanges();
            })
          );
        })
      );
  }

  isFavorite(uid: string, lessonId: string): Observable<boolean> {
    return this.db
      .doc(`users/${uid}/favorites/${lessonId}`)
      .valueChanges()
      .pipe(map((fav) => !!fav));
  }
}
