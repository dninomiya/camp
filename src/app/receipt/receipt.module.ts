import { NgModule } from '@angular/core';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './receipt.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ReceiptComponent],
  imports: [
    SharedModule,
    ReceiptRoutingModule
  ]
})
export class ReceiptModule { }
