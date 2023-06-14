import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { CategoryService } from '../share/services/category.service';
import { Router } from '@angular/router';
import { Category } from '../share/models/category';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../share/services/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterService } from '../share/services/filter/filter.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
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
  searchGroup:FormGroup = new FormGroup({
    search: new FormControl<string>('')
  })

  constructor(private breakpointObserver: BreakpointObserver, private categoryService: CategoryService, private router: Router,
    public sidebarService: SidebarService, public authService: AuthService, private filterService:FilterService,
    public spinnerService:SpinnerService) { }
  
  ngOnInit(): void {
    this.categoriesSub = this.categoryService.getCategories().pipe(take(1)).subscribe((data)=>{
      this.categories = data;
      console.log('TESSSSSSSSSSSSSSSSSSST');
    })
    //this.categories$ = this.categoryService.getCategories$.pipe((data) => { return data }, shareReplay(1))
  }

  ngOnDestroy(): void {
    if(this.categoriesSub!=null)
    {
      this.categoriesSub.unsubscribe();
    }
  }

  mainNav()
  {
    this.router.navigateByUrl('');
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

  search(){
    if(this.searchGroup.get('search')?.value !== '')
    {
      this.filterService.restartState();
      this.filterService.search = this.searchGroup.get('search')?.value
      this.router.navigate(['search'], {queryParams: this.filterService.getUrlQuery()});
    }
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
