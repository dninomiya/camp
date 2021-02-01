import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StripePrice } from '../interfaces/price';
import { StripeProduct } from '../interfaces/stripe-product';

@Injectable({
  providedIn: 'root',
})
export class StripeProductService {
  constructor(private db: AngularFirestore) {}

  getProducts(): Observable<StripeProduct[]> {
    return this.db
      .collection<StripeProduct>('stripeProducts', (ref) =>
        ref.where('active', '==', true)
      )
      .valueChanges();
  }

  getProductSnapshots(): Observable<DocumentChangeAction<StripeProduct>[]> {
    return this.db
      .collection<StripeProduct>('stripeProducts', (ref) =>
        ref.where('active', '==', true)
      )
      .snapshotChanges();
  }

  getPrices(): Observable<StripePrice[]> {
    const productSnaps$ = this.getProductSnapshots();
    return productSnaps$.pipe(
      switchMap((productSnaps) => {
        return combineLatest(
          productSnaps.map((productSnap) => {
            const stripePrices: Observable<StripePrice[]> = this.db
              .collection<StripePrice>(
                `stripeProducts/${productSnap.payload.doc.id}/prices`,
                (ref) => ref.where('active', '==', true)
              )
              .snapshotChanges()
              .pipe(
                map((priceSnaps) => {
                  return priceSnaps.map((priceSnap) => {
                    return {
                      id: priceSnap.payload.doc.id,
                      ...priceSnap.payload.doc.data(),
                    };
                  });
                })
              );
            return stripePrices;
          })
        );
      }),
      map((prices: StripePrice[][]) => {
        const arr = [1, 2, [3, 4]];
        return prices.reduce((acc, val) => acc.concat(val), []);
      })
    );
  }
}
