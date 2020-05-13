import { StorageService } from './storage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Product } from './../interfaces/product';
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

  getAllProducts(): Observable<Product[]> {
    return this.db.collection<Product>('products').valueChanges();
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
