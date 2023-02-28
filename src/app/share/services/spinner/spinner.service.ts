import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  visibility!: BehaviorSubject<boolean>;
  count = 0;
  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  show() {
    this.count++;
    this.visibility.next(true);
  }

  hide() {
    this.count--;
    this.visibility.next(false);
  }
}
