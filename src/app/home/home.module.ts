import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing/home-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { NgAisModule } from 'angular-instantsearch';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    NgAisModule
  ]
})
export class HomeModule { }
