import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, } from '@angular/router';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { ArticleInfo } from './models/article-info';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnDestroy {

  name$ : Observable<ParamMap> = this.route.paramMap
  product$: Observable<ArticleInfo | null> = this.name$.pipe(switchMap((params)=> {
    let id = params.get('id');
    if(id)
    {
      return this.articleService.getArticleInfo(+id);
    }
    return new Observable<null>
  }),
  shareReplay(1))

  constructor(private sidebarService: SidebarService, private route: ActivatedRoute, private articleService:ArticlesService){}

  ngOnDestroy(): void {
    this.sidebarService.enable();
  }
  ngOnInit(): void {
    this.sidebarService.disable();
  }

}
