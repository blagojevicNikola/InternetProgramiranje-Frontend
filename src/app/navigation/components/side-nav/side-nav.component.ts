import { Component, Input } from '@angular/core';
import { Category } from 'src/app/share/models/category';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})

export class SideNavComponent {
  @Input() categories: Category[] | null = [];

  constructor(){
  }
}
