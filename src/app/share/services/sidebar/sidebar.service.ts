import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // visibility!: BehaviorSubject<boolean>;
  vis: boolean = true;;
  //visible$: Observable<boolean> = this.visibility
  constructor() {
    //this.visibility = new BehaviorSubject(true);
   }

  enable() {
    //this.visibility.next(true);
    this.vis = true;
  }

  disable() {
    //this.visibility.next(false);
    this.vis = false;
  }

  get()
  {
    //return this.visibility;
    return this.vis;
  }
}
