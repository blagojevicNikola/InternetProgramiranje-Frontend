import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http:HttpClient) { }

  articlesByType$ = this.http.get<Article>('api/articles/type/')

  getArticlesByType(name: string | null)
  {
    return this.http.get<Article[] | null>(`api/articles/type/${name}`);
  }

  getAllArticles()
  {
    return this.http.get<Article[] | null>(`api/articles`);
  }
}
