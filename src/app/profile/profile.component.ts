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
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private activeProdSub!: Subscription;
  private soldProdSub!: Subscription;
  private boughtProdSub!: Subscription;
  private userSub!: Subscription;
  private userName!: string;

  activeProdPage: number = 0;
  soldProdPage: number = 0;
  boughtProdPage: number = 0;
  activeProducts: any | null;
  soldProducts: any | null;
  boughtProducts: any | null;
  user: User | null = null;
  name$: Observable<ParamMap> = this.route.paramMap

  constructor(private sidebarService: SidebarService, private authService: AuthService, public spinnerService: SpinnerService,
    private route: ActivatedRoute, private articlesService: ArticlesService,
    private router: Router, private usersService: UsersService) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const name = param.get('name');
      if (name != null) {
        this.userName = name;

        this.activeProdSub = this.articlesService.getAllActiveArticlesByUsername(name, null).subscribe((data) => { this.activeProducts = data });
        
        if (this.authService.isAuthenticated()) {
          this.boughtProdSub = this.articlesService.getAllBoughtArticlesByUsername(name, null).subscribe((data) => { this.boughtProducts = data });
        }

        this.soldProdSub = this.articlesService.getAllSoldArticlesByUsername(name, null).subscribe((data) => { this.soldProducts = data });


        this.userSub = this.usersService.getUserPreviewByUsername(name).subscribe((data) => { this.user = data });
      }
    })
  }

  ngOnDestroy(): void {
    if (this.activeProdSub) {
      this.activeProdSub.unsubscribe();
    }
    if (this.soldProdSub) {
      this.soldProdSub.unsubscribe();
    }
    if (this.boughtProdSub) {
      this.boughtProdSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this.sidebarService.enable()
  }

  isAuthenticatedUser() {
    if (this.authService.isAuthenticated() && this.authService.getUsername() === this.route.snapshot.paramMap.get('name')) {
      return true;
    }
    else {
      return false;
    }
  }

  onEditProfile() {
    let username = this.authService.getUsername();
    if (username !== undefined && username !== null) {
      this.router.navigateByUrl(`/profile/edit/${username}`);
    }
  }

  activePageChange(event: PageEvent) {
    if (this.activeProdSub) {
      this.activeProdSub.unsubscribe();
    }
    this.activeProdPage = event.pageIndex;
    this.activeProdSub = this.articlesService.getAllActiveArticlesByUsername(this.userName, event.pageIndex)
      .subscribe({
        next: (value) => {
          this.activeProducts = value;
        }
      })
  }

  soldPageChange(event: PageEvent) {
    if (this.soldProdSub) {
      this.soldProdSub.unsubscribe();
    }
    this.soldProdPage = event.pageIndex;
    this.soldProdSub = this.articlesService.getAllSoldArticlesByUsername(this.userName, event.pageIndex)
      .subscribe({
        next: (value) => {
          this.soldProducts = value;
        }
      })
  }

  boughtPageChange(event: PageEvent) {
    if (this.boughtProdSub) {
      this.boughtProdSub.unsubscribe();
    }
    this.boughtProdPage = event.pageIndex;
    this.boughtProdSub = this.articlesService.getAllBoughtArticlesByUsername(this.userName, event.pageIndex)
      .subscribe({
        next: (value) => {
          this.boughtProducts = value;
        }
      })
  }

}
