import { PriceWithProduct } from './../interfaces/price';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deal',
})
export class DealPipe implements PipeTransform {
  transform(
    prices: PriceWithProduct[],
    currentPrice: PriceWithProduct
  ): string {
    const montry = prices.find((price) => {
      return (
        price.recurring.interval === 'month' &&
        price.recurring.interval_count === 1
      );
    });

    let totalCost: number;

    if (currentPrice.recurring.interval === 'year') {
      totalCost =
        montry.unit_amount * 12 * currentPrice.recurring.interval_count;
    } else if (currentPrice.recurring.interval === 'month') {
      totalCost = montry.unit_amount * currentPrice.recurring.interval_count;
    }

    if (totalCost) {
      return `${totalCost - currentPrice.unit_amount}円お得`;
    } else {
      return null;
    }
  }
}
