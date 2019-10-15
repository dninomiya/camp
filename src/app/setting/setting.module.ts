import { NgModule } from '@angular/core';

import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RootComponent } from './root/root.component';
import { AccountComponent } from './account/account.component';
import { BillingComponent } from './billing/billing.component';
import { MatTabsModule } from '@angular/material';

@NgModule({
  declarations: [
    RootComponent,
    AccountComponent,
    BillingComponent
  ],
  imports: [
    SharedModule,
    SettingRoutingModule,
    MatDialogModule,
    MatTabsModule
  ],
  entryComponents: [
  ]
})
export class SettingModule { }
