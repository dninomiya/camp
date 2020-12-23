import { FromNowPipe } from './../../shared/pipes/from-now.pipe';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { tap, switchMap, startWith } from 'rxjs/operators';
import { ProductWithAuthor } from './../../interfaces/product';
import { Observable } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  providers: [FromNowPipe],
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  loading = true;
  tableLoading = true;
  filter = new FormControl('all');
  users$ = this.filter.valueChanges.pipe(
    startWith('mentor'),
    switchMap((plan) => {
      return this.userService.getUsers(plan);
    }),
    tap(() => (this.tableLoading = false))
  );

  displayedColumns = ['assign', 'point', 'mtg'];

  products$: Observable<
    ProductWithAuthor[]
  > = this.productService
    .getAllProducts()
    .pipe(tap((_) => (this.loading = false)));

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {
    this.filter.valueChanges.subscribe((value) => {
      localStorage.setItem('projectFilter', value);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.filter.patchValue(localStorage.getItem('projectFilter') || 'all');
  }
}
