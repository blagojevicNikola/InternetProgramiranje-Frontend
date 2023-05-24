import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit, OnDestroy{

  private subscribtion!: Subscription; 
  articles: Article[] | null = [];
  page: any | null;
  numOfArticles:number | undefined;
  nameOfArticleType: string | null  = "";
  loading: boolean = false;
  currentPage:number = 0;
  // name$ : Observable<ParamMap> = this.route.paramMap
  // product$: Observable<any | null> = this.name$.pipe(switchMap((params)=> {
  //   let name = params.get('name');
  //   if(name === null)
  //   {
  //     return this.articleService.getAllArticles();
  //   }
  //   else
  //   {
  //     return this.articleService.getArticlesByType(params.get('name'))
  //   }
  // }),
  // shareReplay(1))

  constructor(private articleService:ArticlesService, private route:ActivatedRoute, public spinnerService:SpinnerService)
  {

  }
 

  ngOnInit(): void {
    this.getArticles();
  }

  private getArticles()
  {
    this.route.paramMap.subscribe((val)=>{
      const name = val.get('name');

      if(name === null)
      {
        this.subscribtion = this.articleService.getAllArticles(this.currentPage).subscribe((data)=> {this.page = data});
      }
      else{
        this.subscribtion = this.articleService.getArticlesByType(name, this.currentPage).subscribe((data) => {this.page = data});
      }
    });
  }

  private loadPage()
  {
    if(this.subscribtion)
    {
      this.subscribtion.unsubscribe();
    }
    this.getArticles();
  }

  ngOnDestroy(): void {
    if(this.subscribtion!=null)
    {
      this.subscribtion.unsubscribe();
    }
  }

  onPageChange(event: PageEvent)
  {
    this.currentPage = event.pageIndex;
    this.loadPage();
  }

}
