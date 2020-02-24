import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import {
  throwError,
  Observable,
  of,
  forkJoin,
  Subject,
  BehaviorSubject,
  ReplaySubject
} from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, catchError } from 'rxjs/operators';
import { VimeoPostResponse, VimeoUser } from '../interfaces/vimeo';

import * as tus from 'tus-js-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {
  uploadStepSource = new ReplaySubject<number>();
  uploadStep$ = this.uploadStepSource.asObservable();

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getVimeoAccount(uid: string): Observable<VimeoUser> {
    let tmpToken: string;
    return this.db
      .doc(`users/${uid}/private/vimeo`)
      .valueChanges()
      .pipe(
        switchMap((vimeo: { token: string }) => {
          if (vimeo && vimeo.token) {
            tmpToken = vimeo.token;
            return this.http
              .get('https://api.vimeo.com/me', {
                headers: {
                  Authorization: `bearer ${vimeo.token}`,
                  'Content-Type': 'application/json',
                  Accept: 'application/vnd.vimeo.*+json;version=3.4'
                }
              })
              .pipe(catchError(this.handleError));
          } else {
            return of(null);
          }
        }),
        map(vimeo => {
          if (vimeo) {
            return {
              token: tmpToken,
              account: vimeo.account,
              uploadQuota: vimeo.upload_quota
            };
          } else {
            return null;
          }
        })
      );
  }

  createVideo(
    user: VimeoUser,
    videoSize: number
  ): Observable<{
    videoId: string;
    uploadURL: string;
  }> {
    console.log(user.account);
    return this.http
      .post(
        'https://api.vimeo.com/me/videos',
        {
          upload: {
            approach: 'tus',
            size: Math.ceil(videoSize)
          },
          name: new Date().toString(),
          privacy: {
            view: user.account === 'basic' ? 'anybody' : 'disable',
            embed: user.account === 'basic' ? 'public' : 'whitelist',
            download: user.account === 'basic' ? null : false
          }
        },
        {
          headers: {
            Authorization: `bearer ${user.token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4'
          }
        }
      )
      .pipe(
        map((res: VimeoPostResponse) => {
          return {
            videoId: res.uri.match(/\d+/)[0],
            uploadURL: res.upload.upload_link
          };
        })
      );
  }

  addWhiteList(
    videoId: string,
    token: string,
    domains: string[]
  ): Observable<any> {
    return forkJoin(
      domains.map(domain => {
        return this.http.put(
          `https://api.vimeo.com/videos/${videoId}/privacy/domains/${domain}`,
          null,
          {
            headers: {
              Authorization: `bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.vimeo.*+json;version=3.4'
            }
          }
        );
      })
    );
  }

  uploadVideo(params: {
    user: VimeoUser;
    uploadURL: string;
    file: File;
    videoId: string;
  }) {
    let domains = [];
    if (environment.production) {
      domains = [environment.host];
    } else {
      domains = ['localhost', 'dev-update.firebaseapp.com'];
    }
    if (params.user.account !== 'basic') {
      this.addWhiteList(params.videoId, params.user.token, domains);
    }

    const uploader = new tus.Upload(params.file, {
      uploadUrl: params.uploadURL,
      endpoint: params.uploadURL,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      onError: error => {
        console.error('Failed because: ' + error);
        this.snackBar.open('アップロードがエラーで中断しました', null, {
          duration: 2000
        });
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        console.log(bytesUploaded);
        console.log(bytesTotal);
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        console.log(percentage);
        this.uploadStepSource.next(percentage);
      },
      onSuccess: () => {
        this.snackBar.open('アップロードが完了しました！', null, {
          duration: 2000
        });
        this.uploadStepSource.next(null);
      }
    });

    uploader.start();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  checkVimeoId(params: { id: string; token: string }) {
    return this.http.get(
      `https://api.vimeo.com/me/videos/${params.id}?fields=name`,
      {
        headers: {
          Authorization: `bearer ${params.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        }
      }
    );
  }
}
