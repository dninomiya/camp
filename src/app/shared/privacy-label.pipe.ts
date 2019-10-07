import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privacyLabel'
})
export class PrivacyLabelPipe implements PipeTransform {

  transform(isPublic: boolean, ...args: any[]): any {
    return isPublic ? '公開' : '非公開';
  }

}
