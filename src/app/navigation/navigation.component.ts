import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CategoryService } from '../share/services/category.service';
import { Category } from '../share/models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  categories$ = this.categoryService.getCategories$;
 
  constructor(private breakpointObserver: BreakpointObserver, private categoryService:CategoryService, private router:Router) {}
  
  loginNav(){
    this.router.navigateByUrl('/login')
  }

  registerNav(){
    this.router.navigateByUrl('/register')
  }
}
