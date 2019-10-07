import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EditorComponent } from '../editor/editor/editor.component';

@Injectable({
  providedIn: 'root'
})
export class LessonEditorGuard implements CanDeactivate<EditorComponent> {
  canDeactivate(
    component: EditorComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.form.pristine || component.isComplete) {
      return true;
    }

    const confirmation = window.confirm('作業中の内容が失われますがよろしいですか？');

    return of(confirmation);
  }
}
