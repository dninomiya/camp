import {
  Component,
  OnInit,
  Inject,
  forwardRef,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { NgAisInstantSearch, BaseWidget } from 'angular-instantsearch';
import { connectRefinementList } from 'instantsearch.js/es/connectors';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { lang } from 'moment';

@Component({
  selector: 'app-refinement-list',
  templateUrl: './refinement-list.component.html',
  styleUrls: ['./refinement-list.component.scss']
})
export class RefinementListComponent extends BaseWidget implements OnInit {
  @Output() result = new EventEmitter();
  @Input() old?;
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  tags: {
    label: string;
    count?: number;
  }[] = [];
  tagControl = new FormControl('');
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  lastValue: string;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  state: {
    items: any[];
    searchForItems: any;
  };
  tagOptions = [];

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('RefinementListComponent');
  }

  ngOnInit() {
    this.createWidget(connectRefinementList, {
      attribute: 'tags'
    });
    super.ngOnInit();

    if (this.old) {
      this.tags = this.old.map(label => ({ label }));
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        if (!this.isExsists(value)) {
          this.tags.push({
            label: value
          });
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagControl.setValue(null);
      this.result.emit(this.tags);
    }
  }

  handleChange($event: KeyboardEvent) {
    const value = ($event.target as HTMLInputElement).value;
    if (this.lastValue !== value) {
      this.state.searchForItems(value);
      this.tagOptions = this.state.items.filter(
        item => !this.isExsists(item.label)
      );
      this.lastValue = value;
    }
  }

  remove(value: { label: string }): void {
    const index = this.tags.findIndex(tag => tag.label === value.label);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.result.emit(this.tags);
    }
  }

  private isExsists(value: string): boolean {
    return !!this.tags.find(tag => tag.label === value);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.isExsists(event.option.value.label)) {
      this.tags.push(event.option.value);
      this.tagInput.nativeElement.value = '';
      this.tagControl.setValue(null);
      this.result.emit(this.tags);
    }
  }
}
