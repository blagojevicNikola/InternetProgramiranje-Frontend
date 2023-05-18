import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private visibility!: BehaviorSubject<boolean>;
  count = 0;
  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  show() {
    this.visibility.next(true);
  }

  hide() {
    this.visibility.next(false);
  }

  getLoadingStatus() : Observable<boolean>{
    return this.visibility.asObservable();
  }
}
