import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkIcon',
})
export class LinkIconPipe implements PipeTransform {
  transform(url: string, ...args: any[]): any {
    if (url && url.match(/github|twitter|facebook/)) {
      return `fab fa-${url.match(/github|twitter|facebook/)}`;
    } else if (url && url.match('youtube')) {
      return 'fa fa-youtube-play';
    } else {
      return 'fas fa-home';
    }
  }
}
