import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalAccountFormComponent } from './external-account-form/external-account-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonFormComponent } from './person-form/person-form.component';

@NgModule({
  declarations: [
    ExternalAccountFormComponent,
    AddressFormComponent,
    CompanyFormComponent,
    PersonFormComponent
  ],
  imports: [SharedModule],
  exports: [
    ExternalAccountFormComponent,
    AddressFormComponent,
    CompanyFormComponent,
    PersonFormComponent
  ]
})
export class ConnectFormModule {}
