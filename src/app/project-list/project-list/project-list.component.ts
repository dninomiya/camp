import { tap } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { Product, ProductWithAuthor } from './../../interfaces/product';
import { of, Observable } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  products$: Observable<
    ProductWithAuthor[]
  > = this.productService
    .getAllProducts()
    .pipe(tap((_) => (this.loading = false)));

  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}
}
