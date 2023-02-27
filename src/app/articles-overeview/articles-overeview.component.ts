import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit{

  articles: Article[] | null = [];
  numOfArticles:number | undefined;
  nameOfArticleType: string | null  = "";
  product$: Observable<any> = this.route.paramMap.pipe(
    switchMap(params => {
       let name = params.get('name');
       return this.articleService.getArticlesByType(name);
    }))
  constructor(private articleService:ArticlesService, private route:ActivatedRoute)
  {
    this.nameOfArticleType = route.snapshot.queryParamMap.get('name');
  }

  ngOnInit(): void {
    
  }

}
