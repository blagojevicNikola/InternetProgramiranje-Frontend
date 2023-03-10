import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CategoryService } from '../share/services/category.service';
import { Router } from '@angular/router';
import { Category } from '../share/models/category';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../share/services/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map((result) => {
        return result.matches;
      }),
      shareReplay()
    );

  @ViewChild('drawer') matDrawer!: MatSidenav;

  test$: Observable<boolean> = this.sidebarService.get()

  categories$!: Observable<Category[]> | null

  constructor(private breakpointObserver: BreakpointObserver, private categoryService: CategoryService, private router: Router,
    public sidebarService: SidebarService, public authService: AuthService) { }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories$.pipe((data) => { return data }, shareReplay(1))
  }

  loginNav() {
    this.router.navigateByUrl('/login')
  }

  registerNav() {
    this.router.navigateByUrl('/register')
  }

  toggle() {
    this.matDrawer.toggle();
  }
}
