import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, } from '@angular/router';
import { map, Observable, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { ArticlesService } from '../share/services/articles/articles.service';
import { AuthService } from '../share/services/auth/auth.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { ArticleInfo } from './models/article-info';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApproveDialogComponent } from './components/approve-dialog/approve-dialog.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnDestroy {

  articleInfo!:ArticleInfo | null;
  articleInfoSub!: Subscription;
  private idOfArticle: number | null = null;
  private deleteSub: Subscription | null = null;
  // name$ : Observable<ParamMap> = this.route.paramMap
  // product$: Observable<ArticleInfo | null> = this.name$.pipe(switchMap((params)=> {
  //   let id = params.get('id');
  //   if(id)
  //   {
  //     return this.articleService.getArticleInfo(+id).pipe(tap(data => this.articleInfo=data));
  //   }
  //   return new Observable<null>
  // }),
  // shareReplay(1))

  constructor(private authService:AuthService, private sidebarService: SidebarService,
    private route: ActivatedRoute, private articleService:ArticlesService,
    private router:Router, public spinnerService:SpinnerService, 
    private snackBar:MatSnackBar, private dialog:MatDialog){
    this.sidebarService.disable();
  }

  ngOnDestroy(): void {
    if(this.articleInfoSub)
    {
      this.articleInfoSub.unsubscribe();
    }
    if(this.deleteSub)
    {
      this.deleteSub.unsubscribe();
    }
    this.sidebarService.enable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
      let id = param.get('id');
      if(id)
      {
        this.idOfArticle = +id;
        this.articleInfoSub = this.articleService.getArticleInfo(+id).subscribe((data)=>{this.articleInfo = data});
      }
    })
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  isAuthenticatedUser()
  {
    if(this.articleInfo===null)
    {
      return false;
    }
    if(this.authService.isAuthenticated() && this.articleInfo.user.username===this.authService.getUsername())
    {
      return true;
    }
      return false;
  }

  openProfile()
  {
    this.router.navigateByUrl(`profile/${this.articleInfo?.user.username}`)
  }

  onDeleteArticle()
  {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {data: {message: "Da li zelite da obrisete ovaj artikal?"}})
    dialogRef.afterClosed().subscribe((result) => {
      if(this.idOfArticle && result)
      {
        this.deleteSub = this.articleService.deleteArticle(this.idOfArticle).subscribe({
          next:() => {
            this.snackBar.open("Artikal uspjesno obrisan!", "U redu", {duration: 3000});
          },
          error:() => {
            this.snackBar.open("Greska prilikom brisanja artikla!", "U redu", {duration: 3000});
          }
        })
      }
    });
  }

  onUpdateArticle()
  {
    this.router.navigateByUrl(`update/${this.idOfArticle}`);
  }
}
