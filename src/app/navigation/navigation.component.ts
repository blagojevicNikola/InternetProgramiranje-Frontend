import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
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
export class NavigationComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map((result) => {
        return result.matches;
      }),
      shareReplay()
    );

  @ViewChild('drawer') matDrawer!: MatSidenav;

  //test$: Observable<boolean> = this.sidebarService.get()
  private categoriesSub!: Subscription;
  //categories$!: Observable<Category[]> | null
  categories:Category[] | null = null;

  constructor(private breakpointObserver: BreakpointObserver, private categoryService: CategoryService, private router: Router,
    public sidebarService: SidebarService, public authService: AuthService) { }
  
  ngOnInit(): void {
    this.categoriesSub = this.categoryService.getCategories().subscribe((data)=>{
      this.categories = data;
    })
    //this.categories$ = this.categoryService.getCategories$.pipe((data) => { return data }, shareReplay(1))
  }

  ngOnDestroy(): void {
    if(this.categoriesSub!=null)
    {
      this.categoriesSub.unsubscribe();
    }
  }

  loginNav() {
    this.router.navigateByUrl('/login')
  }

  registerNav() {
    this.router.navigateByUrl('/register')
  }

  profileNav(){
    this.router.navigateByUrl(`/profile/${this.authService.getUsername()}`)
  }

  addNav():void{
    this.router.navigateByUrl('/article/new');
  }

  supportNav(){
    this.router.navigateByUrl('/support/chat');
  }

  toggle() {
    this.matDrawer.toggle();
  }

  get showSidenav() : boolean
  {
    return this.sidebarService.get();
  }

  logOut()
  {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
