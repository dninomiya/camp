import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { VimeoUser } from 'src/app/interfaces/vimeo';
import * as tus from 'tus-js-client';
import { VimeoPostResponse } from '../interfaces/vimeo';

const VIMEO_TOKEN = '32561c209bf7a6ebe876a4b870609a7d';

@Injectable({
  providedIn: 'root',
})
export class VimeoService {
  uploadStepSource = new ReplaySubject<number>(1);
  uploadStep$ = this.uploadStepSource.asObservable();

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getVimeoAccount(): Promise<VimeoUser> {
    return this.http
      .get('https://api.vimeo.com/me', {
        headers: {
          Authorization: `bearer ${VIMEO_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vimeo.*+json;version=3.4',
        },
      })
      .pipe(
        map((user: any) => {
          return {
            uploadQuota: user.upload_quota,
          };
        })
      )
      .toPromise();
  }

  createVideo(
    videoSize: number
  ): Promise<{
    videoId: string;
    uploadURL: string;
  }> {
    return this.http
      .post(
        'https://api.vimeo.com/me/videos',
        {
          upload: {
            approach: 'tus',
            size: Math.ceil(videoSize),
          },
          name: new Date().toString(),
          privacy: {
            view: 'disable',
            embed: 'whitelist',
            download: false,
          },
        },
        {
          headers: {
            Authorization: `bearer ${VIMEO_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
          },
        }
      )
      .pipe(
        map((res: VimeoPostResponse) => {
          return {
            videoId: res.uri.match(/\d+/)[0],
            uploadURL: res.upload.upload_link,
          };
        })
      )
      .toPromise();
  }

  async uploadVideo(params: { uploadURL: string; file: File }) {
    const uploader = new tus.Upload(params.file, {
      uploadUrl: params.uploadURL,
      endpoint: params.uploadURL,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      onError: (error) => {
        console.error('Failed because: ' + error);
        this.snackBar.open('アップロードがエラーで中断しました', null, {
          duration: 2000,
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
          duration: 2000,
        });
        this.uploadStepSource.next(null);
      },
    });

    uploader.start();
  }
}
