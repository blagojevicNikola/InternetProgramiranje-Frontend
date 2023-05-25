import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription, shareReplay, switchMap } from 'rxjs';
import { User } from '../review/models/user';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';
import { AuthService } from '../share/services/auth/auth.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { UsersService } from '../share/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private activeProdSub!: Subscription;
  private soldProdSub!: Subscription;
  private userSub!:Subscription;

  activeProducts:any|null;
  soldProducts:any|null;
  user:User|null = null;
  name$: Observable<ParamMap> = this.route.paramMap

  // activeProducts$: Observable<any | null> = this.name$.pipe(switchMap((params) => {
  //   return this.articlesService.getAllActiveArticlesByUsername(params.get('name'))
  // }),
  //   shareReplay(1))

  // soldProducts$: Observable<any | null> = this.name$.pipe(switchMap((params) => {
  //   return this.articlesService.getAllSoldArticlesByUsername(params.get('name'))
  // }),
  //   shareReplay(1))

  // user$: Observable<User | null> = this.name$.pipe(switchMap((params) => {
  //   return this.usersService.getUserInfoByUsername(params.get('name'))
  // }),
  //   shareReplay(1))

  constructor(private sidebarService: SidebarService, private authService:AuthService, public spinnerService: SpinnerService,
     private route: ActivatedRoute, private articlesService: ArticlesService, 
     private router: Router, private usersService: UsersService) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
      const name = param.get('name');
      this.activeProdSub = this.articlesService.getAllActiveArticlesByUsername(name).subscribe((data)=>{this.activeProducts = data});

      this.soldProdSub = this.articlesService.getAllSoldArticlesByUsername(name).subscribe((data)=>{this.soldProducts = data});

      this.userSub = this.usersService.getUserPreviewByUsername(name).subscribe((data)=>{this.user = data});
    })
  }

  ngOnDestroy(): void {
    if(this.activeProdSub)
    {
      this.activeProdSub.unsubscribe();
    }
    if(this.soldProdSub)
    {
      this.soldProdSub.unsubscribe();
    }
    if(this.userSub)
    {
      this.userSub.unsubscribe();
    }
    this.sidebarService.enable()
  }

  isAuthenticatedUser()
  {
    if(this.authService.isAuthenticated() && this.authService.getUsername()===this.route.snapshot.paramMap.get('name'))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  onEditProfile()
  {
    let username = this.authService.getUsername();
    if(username!==undefined && username!==null)
    {
      this.router.navigateByUrl(`/profile/edit/${username}`);
    }
  }

}
