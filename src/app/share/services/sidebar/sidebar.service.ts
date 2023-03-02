import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  visibility!: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(true);
   }

  enable() {
    this.visibility.next(true);
  }

  disable() {
    this.visibility.next(false);
  }
}
