import { NgModule } from '@angular/core';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../shared/shared.module';
import { NgAisModule } from 'angular-instantsearch';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    SearchRoutingModule,
    NgAisModule
  ]
})
export class SearchModule { }
