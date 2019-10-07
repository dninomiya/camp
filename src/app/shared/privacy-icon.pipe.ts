import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privacyIcon'
})
export class PrivacyIconPipe implements PipeTransform {

  transform(isPublic: boolean, ...args: any[]): any {
    return isPublic ? 'public' : 'lock';
  }

}
