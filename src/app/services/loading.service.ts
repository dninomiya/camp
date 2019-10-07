import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSource: Subject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSource.asObservable();

  constructor() { }

  startLoading() {
    this.loadingSource.next(true);
  }

  endLoading() {
    this.loadingSource.next(false);
  }
}
