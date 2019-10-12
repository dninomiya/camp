import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap, tap, shareReplay } from 'rxjs/operators';
import { User as AfUser, auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from '../interfaces/user';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  afUser: AfUser;
  authUser$: Observable<any>;
  user: User;
  isAdmin: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private fns: AngularFireFunctions,
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
      tap(user => {
        this.user = user;
        if (user && user.admin) {
          this.isAdmin = true;
        }
      }),
      shareReplay(1)
    );
  }

  async login(): Promise<void> {
    if (this.afUser) {
      await this.afAuth.auth.signOut();
    }
    const authProvider = new auth.GoogleAuthProvider();
    authProvider.setCustomParameters({
      prompt: 'select_account'
    });
    await this.afAuth.auth.signInWithPopup(authProvider);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/']));
  }

  async deleteAccount(uid: string): Promise<void> {
    if (uid) {
      const deleteFn = this.fns.httpsCallable('deleteUser');
      return deleteFn({ uid }).toPromise();
    } else {
      console.log('uid is not found.');
    }
  }

  deleteMyAccount(): Promise<void> {
    return this.deleteAccount(this.afUser.uid).then(() => {
      this.router.navigate(['']);
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
        await callable({code}).toPromise();
        return data.path;
      }
    } else {
      throw new Error(`トークンが存在しません:/studio/${this.user.id}/plans`);
    }
  }

  async connectVimeo(code: string, scrf: string): Promise<string> {
    const data = (await this.db.doc(`csrf/${scrf}`).ref.get()).data();

    if (data) {
      // await this.db.doc(`csrf/${scrf}`).delete();

      if (data.uid !== this.user.id) {
        throw new Error('ユーザーが不正です');
      }

      const now = moment();
      const diffHours = now.diff(moment(data.createdAt.toDate()), 'hours');

      if (diffHours > 2) {
        throw new Error(`トークンの有効期限が切れました:${data.path}`);
      } else {
        const callable = this.fns.httpsCallable('connectVimeo');
        await callable({code}).toPromise();
        return data.path;
      }
    } else {
      throw new Error(`トークンが存在しません:/studio/${this.user.id}/plans`);
    }
  }

  setFCMToken(fcmToken: string): Promise<void> {
    return this.db.doc(`users/${this.user.id}`).update({
      fcmToken
    });
  }

  async createSCRF(body: {
    uid: string,
    path: string
  }): Promise<string> {
    const id = this.db.createId();
    await this.db.doc(`csrf/${id}`).set({
      ...body,
      createdAt: new Date()
    });
    return id;
  }
}
