import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate  {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return true;
    // return combineLatest([
    //   this.authService.getUserPayment(),
    //   this.authService.authUser$
    // ]).pipe(
    //   map(([payment, user]) => {
    //     const isPayment =  payment && payment.subscriptionId;
    //     const isFrontRunner = user && user.plan === Plan.FRONTRUNNER;
    //     const isNPO = user && user.plan === Plan.ASSITANCE;
    //     if (!user) {
    //       this.router.navigate(['welcome']);
    //     } else if (isPayment || isFrontRunner || isNPO) {
    //       this.router.navigate(['']);
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   })
    // );
  }
}
