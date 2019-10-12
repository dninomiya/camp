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
              const data = error.split(':');
              const errorMessage = data[0];
              const path = data[1];
              this.snackBar.open(errorMessage, null, {
                duration: 2000
              });
              this.router.navigateByUrl(path);
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
