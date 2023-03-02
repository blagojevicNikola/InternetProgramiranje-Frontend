import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit{

  articles: Article[] | null = [];
  numOfArticles:number | undefined;
  nameOfArticleType: string | null  = "";
  loading: boolean = false;
  name$ : Observable<ParamMap> = this.route.paramMap
  product$: Observable<Article[] | null> = this.name$.pipe(switchMap((params)=> {
    let name = params.get('name');
    if(name === '')
    {
      return this.articleService.getAllArticles();
    }
    else
    {
      return this.articleService.getArticlesByType(params.get('name'))
    }
  }),
  shareReplay(1))

  constructor(private articleService:ArticlesService, private route:ActivatedRoute, public spinnerService:SpinnerService)
  {

  }

  ngOnInit(): void {
  }

}
