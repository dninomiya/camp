import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { VimeoPostResponse, VimeoUser } from 'src/app/interfaces/vimeo';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-vimeo-dialog',
  templateUrl: './vimeo-dialog.component.html',
  styleUrls: ['./vimeo-dialog.component.scss']
})
export class VimeoDialogComponent implements OnInit {

  uploadURL: string;
  size: number;
  unit: string;
  file: File;
  isBasic: boolean;
  vimeoAccount$: Observable<VimeoUser>;
  videoId: string;

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private user: User,
    private vimeoService: VimeoService
  ) { }

  ngOnInit() {
    this.vimeoAccount$ = this.vimeoService.getVimeoAccount(this.user.id);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  handleFileSelected(event) {
    this.file = event.srcElement.files[0];
    this.size = this.file.size;
  }

  createVideo(user: VimeoUser) {
    this.vimeoService.createVideo(user, this.file.size)
      .subscribe(res => {
        this.uploadURL = res.uploadURL;
        this.videoId = res.videoId;
      });
  }

  uploadVideo(user: VimeoUser) {
    this.vimeoService.uploadVideo({
      user,
      uploadURL: this.uploadURL,
      file: this.file,
      videoId: this.videoId
    });
    this.http.patch(
      this.uploadURL,
      this.file,
      {
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': '0',
          'Content-Type': 'application/offset+octet-stream',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        },
        observe: 'response'
      }
    ).toPromise().then(res => {
      console.log(res.headers.get('Upload-Offset'));
    });
  }

  check() {
    this.http.head(
      this.uploadURL,
      {
        headers: {
          'Tus-Resumable': '1.0.0',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        },
        observe: 'response'
      }
    ).subscribe(res => {
      console.log(res.headers.get('Upload-Length'));
      console.log(res.headers.get('Upload-Offset'));
    });
  }

}
