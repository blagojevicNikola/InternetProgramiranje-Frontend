import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArticleInfo } from 'src/app/review/models/article-info';
import { Article } from '../../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http:HttpClient) { }

  articlesByType$ = this.http.get<Article>('api/articles/type/')

  getArticlesByType(name: string | null)
  {
    return this.http.get<any | null>(`api/articles/type/${name}`);
  }

  getAllArticles()
  {
    return this.http.get<any | null>(`api/articles/all`);
  }

  getArticleInfo(id: number)
  {
    return this.http.get<ArticleInfo>(`api/articles/info/${id}`)
  }

  getAllActiveArticlesByUsername(name: string | null)
  {
    return this.http.get<any | null> (`api/articles/active/user/${name}`);
  }

  getAllSoldArticlesByUsername(name: string | null)
  {
    return this.http.get<any | null> (`api/articles/sold/user/${name}`);
  }

  createArticle(data: FormData)
  {
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data' // Set the content type to 'multipart/form-data'
    });
    const options = { headers: headers };

    return this.http.post(`api/articles/create`, data);
  }
}
