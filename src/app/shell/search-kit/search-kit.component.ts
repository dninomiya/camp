import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { NgAisInstantSearch, BaseWidget } from 'angular-instantsearch';
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-kit',
  templateUrl: './search-kit.component.html',
  styleUrls: ['./search-kit.component.scss']
})
export class SearchKitComponent extends BaseWidget implements OnInit {
  state: {
    query: string;
    refine: any;
    indices: any[];
  };

  searchInput = new FormControl('');
  lastValue = '';

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super('Autocomplete');
    this.route.queryParamMap.subscribe(params => {
      if (params.get('q')) {
        this.searchInput.patchValue(params.get('q'));
      }
    });
  }

  public handleChange($event: KeyboardEvent) {
    const value = ($event.target as HTMLInputElement).value;
    if (this.lastValue !== value) {
      this.state.refine(value);
      this.lastValue = value;
    }
  }

  public ngOnInit() {
    this.createWidget(connectAutocomplete, {});
    super.ngOnInit();
  }

  selected($event: MatAutocompleteSelectedEvent, input) {
    const value = $event.option.value as LessonMeta;
    input.value = '';
    this.router.navigate(['/lesson'], {
      queryParams: {
        v: value.id
      }
    });
  }

  saerch(q: string) {
    this.router.navigate(['/search'], {
      queryParams: {
        q
      }
    });
  }

}
