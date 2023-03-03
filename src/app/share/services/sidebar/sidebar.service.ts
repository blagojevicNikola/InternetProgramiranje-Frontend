import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  visibility!: BehaviorSubject<boolean>;

  visible$: Observable<boolean> = this.visibility
  constructor() {
    this.visibility = new BehaviorSubject(true);
   }

  enable() {
    this.visibility.next(true);
  }

  disable() {
    this.visibility.next(false);
  }

  get()
  {
    return this.visibility;
  }
}
