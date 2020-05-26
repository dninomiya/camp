import { User } from 'src/app/interfaces/user';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customer',
})
export class CustomerPipe implements PipeTransform {
  transform(user: User | null): boolean {
    if (!user || !user.plan) {
      return false;
    }

    return user.plan !== 'free';
  }
}
