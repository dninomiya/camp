import { CreditCardModule } from './../credit-card/credit-card.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';


@NgModule({
  declarations: [SignupComponent],
  imports: [
    SharedModule,
    SignupRoutingModule,
    CreditCardModule
  ]
})
export class SignupModule { }
