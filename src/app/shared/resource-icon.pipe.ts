import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resourceIcon',
})
export class ResourceIconPipe implements PipeTransform {
  rules: {
    url: string;
    iconName?: string;
  }[] = [
    { url: 'github' },
    { url: 'help.github', iconName: 'github' },
    { url: 'developer.mozilla', iconName: 'mozilla' },
    { url: 'algolia' },
    { url: 'stackblitz' },
    { url: 'stripe' },
    { url: 'sendgrid' },
    { url: 'firebase' },
    { url: 'qiita' },
    { url: 'codepen' },
  ];

  reg(key: string): RegExp {
    return new RegExp('^https?://(www.)?' + key);
  }

  transform(url: string, type: 'svg' | 'material'): string {
    if (type === 'material') {
      return 'public';
    }

    if (type === 'svg') {
      for (const rule of this.rules) {
        if (url.match(this.reg(rule.url))) {
          return rule.iconName || rule.url;
        }
      }
    }
  }
}
