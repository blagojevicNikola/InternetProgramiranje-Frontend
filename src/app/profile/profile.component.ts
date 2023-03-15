import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { User } from '../review/models/user';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { UsersService } from '../share/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy{

  name$ : Observable<ParamMap> = this.route.paramMap

  activeProducts$: Observable<Article[] | null> = this.name$.pipe(switchMap((params)=> {
      return this.articlesService.getAllActiveArticlesByUsername(params.get('name'))
  }),
  shareReplay(1))

  soldProducts$: Observable<Article[] | null> = this.name$.pipe(switchMap((params)=> {
    return this.articlesService.getAllSoldArticlesByUsername(params.get('name'))
  }),
  shareReplay(1))

  user$: Observable<User | null> = this.name$.pipe(switchMap((params)=> {
    return this.usersService.getUserInfoByUsername(params.get('name'))
  }),
  shareReplay(1))

  constructor(private sidebarService:SidebarService, private route:ActivatedRoute, private articlesService:ArticlesService, private usersService:UsersService){
    this.sidebarService.disable();
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.sidebarService.enable()
  }

}
