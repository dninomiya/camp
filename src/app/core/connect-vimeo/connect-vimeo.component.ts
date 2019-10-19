import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-connect-vimeo',
  templateUrl: './connect-vimeo.component.html',
  styleUrls: ['./connect-vimeo.component.scss']
})
export class ConnectVimeoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.state && params.code) {
        this.authService.connectVimeo(params.code, params.state)
          .then(path => {
            this.router.navigateByUrl(path);
          })
          .catch(error => {
            if (error) {
              console.error(error);
              this.snackBar.open('連携に失敗しました', null, {
                duration: 2000
              });
            }
          });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit() {
  }

}
