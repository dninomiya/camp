import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  algoliaConfig = environment.algolia;

  searchParameters = {
    query: '',
    hitsPerPage: 100,
    filters: 'NOT deleted:true'
  };

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(query => {
      this.searchParameters.query = query.get('q');
    });
  }

  ngOnInit() {
  }

}
