import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-connect-stripe',
  templateUrl: './connect-stripe.component.html',
  styleUrls: ['./connect-stripe.component.scss']
})
export class ConnectStripeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.state && params.code) {
        this.authService.connectStripe(params.code, params.state)
          .then(path => {
            this.router.navigateByUrl(path);
          })
          .catch(error => {
            if (error) {
              console.log(error);
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
        this.router.navigate(['studio', this.authService.user.id, 'plans']);
      }
    });
  }

  ngOnInit() {
  }

}
