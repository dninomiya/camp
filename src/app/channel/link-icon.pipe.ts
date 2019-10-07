import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkIcon'
})
export class LinkIconPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value.match('twitter')) {
      return 'fab fa-twitter';
    } else if (value.match('instagram')) {
      return 'fab fa-instagram';
    } else if (value.match('youtube')) {
      return 'fab fa-youtube';
    } else if (value.match('facebook')) {
      return 'fab fa-facebook';
    } else if (value.match('github')) {
      return 'fab fa-github';
    } else if (value.match('gitlab')) {
      return 'fab fa-gitlab';
    } else if (value.match('gitlab')) {
      return 'fab fa-speaker-deck';
    } else if (value.match('speakerdeck')) {
      return 'fab fa-speaker-deck';
    } else if (value.match('note.mu')) {
      return 'far fa-sticky-note';
    } else {
      return 'fas fa-globe-asia';
    }
    return null;
  }

}
