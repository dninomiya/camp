import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VimeoUser } from 'src/app/interfaces/vimeo';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { VimeoService } from 'src/app/services/vimeo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vimeo-dialog',
  templateUrl: './vimeo-dialog.component.html',
  styleUrls: ['./vimeo-dialog.component.scss']
})
export class VimeoDialogComponent implements OnInit {

  private clientId = '45622d0c9345317a2482c24ecbdc9f3552eda034';
  private redirectURI = 'http://localhost:4200/connect-vimeo';
  private scopes = 'private,edit,upload,public';

  authURL: string;
  uploadURL: string;
  size: number;
  unit: string;
  file: File;
  isBasic: boolean;
  vimeoAccount$: Observable<VimeoUser>;
  videoId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private user: User,
    private vimeoService: VimeoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.vimeoAccount$ = this.vimeoService.getVimeoAccount(this.user.id);
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
        this.uploadVideo(user);
      });
  }

  uploadVideo(user: VimeoUser) {
    this.vimeoService.uploadVideo({
      user,
      uploadURL: this.uploadURL,
      file: this.file,
      videoId: this.videoId
    });
  }

  connectVimeo() {
    this.authService.createSCRF({
      uid: this.authService.user.id,
      path: this.router.url
    }).then((csrf) => {
      window.open(`https://api.vimeo.com/oauth/authorize?response_type=code&` +
      `client_id=${this.clientId}&redirect_uri=${this.redirectURI}` +
      `&state=${csrf}&scope=${this.scopes}`);
    });
  }
}
