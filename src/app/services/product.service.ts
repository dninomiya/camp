import { User } from './../interfaces/user';
import { switchMap, map, filter } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, combineLatest, of } from 'rxjs';
import { Product, ProductWithAuthor } from './../interfaces/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private db: AngularFirestore,
    private storageService: StorageService
  ) {}

  getAllProducts(): Observable<ProductWithAuthor[]> {
    const projects$: Observable<Product[]> = this.db
      .collection<Product>('products')
      .valueChanges()
      .pipe(map((projects) => projects.filter((project) => project.public)));

    const authors$: Observable<User[]> = projects$.pipe(
      switchMap((products) => {
        if (products?.length) {
          combineLatest(
            products.map((product) =>
              this.db.doc<User>(`users/${product.authorId}`).valueChanges()
            )
          );
        } else {
          return of([]);
        }
      })
    );

    return combineLatest([projects$, authors$]).pipe(
      map(([projects, users]) => {
        if (projects?.length) {
          return projects.map((project, index) => {
            return {
              ...project,
              author: users[index],
            };
          });
        } else {
          return null;
        }
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.db.doc<Product>(`products/${id}`).valueChanges();
  }

  async saveProduct(
    uid: string,
    product: Omit<Product, 'id' | 'author'>,
    file: string
  ): Promise<void> {
    const data = {
      id: uid,
      ...product,
    };

    if (file) {
      data.thumbnailURL = await this.storageService.upload(
        `products/${uid}`,
        file
      );
    }

    return this.db
      .doc<Omit<Product, 'author'>>(`products/${uid}`)
      .set(data, { merge: true });
  }
}
