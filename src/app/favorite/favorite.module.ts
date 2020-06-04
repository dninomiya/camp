import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';

@NgModule({
  declarations: [FavoriteComponent],
  imports: [SharedModule, FavoriteRoutingModule],
})
export class FavoriteModule {}
