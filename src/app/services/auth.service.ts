import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  tap,
  shareReplay,
  map,
  distinctUntilChanged,
} from 'rxjs/operators';
import { User as AfUser, auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from '../interfaces/user';
import * as moment from 'moment';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afUser: AfUser;
  authUser$: Observable<User>;
  user: User;
  isAdmin: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private fns: AngularFireFunctions,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.authUser$ = this.afAuth.authState.pipe(
      switchMap((afUser: AfUser) => {
        this.afUser = afUser;
        if (afUser) {
          return this.db.doc<User>(`users/${afUser.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }),
      tap((user) => {
        this.user = user;
        if (user && user.admin) {
          this.isAdmin = true;
        }
      }),
      shareReplay(1)
    );

    this.db
      .collectionGroup('private', (ref) =>
        ref.where('githubUniqueId', '==', 5842851)
      )
      .valueChanges()
      .subscribe((res) => {
        console.log(res);
      });
  }

  async login(): Promise<auth.UserCredential> {
    if (this.afUser) {
      await this.afAuth.signOut();
    }
    const authProvider = new auth.GoogleAuthProvider();
    authProvider.setCustomParameters({
      prompt: 'select_account',
    });
    return this.afAuth.signInWithPopup(authProvider);
  }

  logout() {
    this.afAuth.signOut().then(() => this.router.navigate(['/']));
  }

  async deleteAccount(user: AfUser): Promise<void> {
    const deleteFn = this.fns.httpsCallable('deleteUser');
    return deleteFn({
      uid: user.uid,
      email: user.email,
    }).toPromise();
  }

  deleteMyAccount(): Promise<void> {
    return this.deleteAccount(this.afUser).then(() => {
      this.router.navigate(['/']);
    });
  }

  updateUser(data: any): Promise<void> {
    return this.db.doc(`users/${this.afUser.uid}`).update(data);
  }

  async connectStripe(code: string, scrf: string): Promise<string> {
    const data = (await this.db.doc(`csrf/${scrf}`).ref.get()).data();

    if (data) {
      await this.db.doc(`csrf/${scrf}`).delete();

      if (data.uid !== this.user.id) {
        throw new Error('ユーザーが不正です');
      }

      const now = moment();
      const diffHours = now.diff(moment(data.createdAt.toDate()), 'hours');

      if (diffHours > 2) {
        throw new Error(`トークンの有効期限が切れました:${data.path}`);
      } else {
        const callable = this.fns.httpsCallable('connectStripe');
        await callable({
          code,
          email: this.user.email,
        }).toPromise();
        return data.path;
      }
    } else {
      throw new Error(`トークンが存在しません:/studio/${this.user.id}/plans`);
    }
  }

  async connectVimeo(code: string, scrf: string): Promise<string> {
    const data = (await this.db.doc(`csrf/${scrf}`).ref.get()).data();

    if (data) {
      await this.db.doc(`csrf/${scrf}`).delete();

      if (data.uid !== this.user.id) {
        throw new Error('ユーザーが不正です');
      }

      const now = moment();
      const diffHours = now.diff(moment(data.createdAt.toDate()), 'hours');

      if (diffHours > 2) {
        throw new Error(`トークンの有効期限が切れました:${data.path}`);
      } else {
        const callable = this.fns.httpsCallable('connectVimeo');
        await callable({ code }).toPromise();
        return data.path;
      }
    } else {
      throw new Error(`トークンが存在しません:/studio/${this.user.id}/plans`);
    }
  }

  setFCMToken(fcmToken: string): Promise<void> {
    return this.db.doc(`users/${this.user.id}`).update({
      fcmToken,
    });
  }

  async createSCRF(body: { uid: string; path: string }): Promise<string> {
    const id = this.db.createId();
    await this.db.doc(`csrf/${id}`).set({
      ...body,
      createdAt: new Date(),
    });
    return id;
  }

  openLoginDialog() {
    this.dialog
      .open(LoginDialogComponent, {
        restoreFocus: false,
        width: '400px',
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.login().then(() => {
            this.snackBar.open(`${environment.title}へようこそ！`, null, {
              duration: 2000,
            });
          });
        }
      });
  }

  async connectGitHub(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user.providerData.find((prov) => prov.providerId === 'github.com')) {
      await user.unlink('github.com');
    }
    const provider = new auth.GithubAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    const result = await user.linkWithPopup(provider);
    const data: any = result.credential;
    const addedUser: any = result.additionalUserInfo.profile;

    return this.db.doc(`users/${result.user.uid}/private/token`).set(
      {
        github: data.accessToken,
        githubUniqueId: addedUser.id,
      },
      { merge: true }
    );
  }

  getGitHubData(): Observable<{
    github: string;
    githubUniqueId: string;
  }> {
    return this.authUser$.pipe(
      map((user) => !!user),
      distinctUntilChanged(),
      switchMap((user) => {
        if (user) {
          return this.db
            .doc<{ github: string }>(`users/${this.user.id}/private/token`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
}
