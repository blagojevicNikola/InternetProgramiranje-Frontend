import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArticleInfo } from 'src/app/review/models/article-info';
import { Article } from '../../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http:HttpClient) { }

  articlesByType$ = this.http.get<Article>('api/articles/type/')

  getArticlesByType(name: string | null, params: {[key:string]:string})
  {
    let queryParams = new HttpParams();
    for(const key in params)
    {
      queryParams = queryParams.append(key,params[key]);
    }
    return this.http.get<any | null>(`api/articles/type/${name}`,{params: queryParams});
  }

  getAllArticles(params: {[key:string]:string})
  {
    let queryParams = new HttpParams();
    for(const key in params)
    {
      queryParams = queryParams.append(key,params[key]);
    }
    return this.http.get<any | null>(`api/articles/all`,{params: queryParams});
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
    return this.http.post(`api/articles/create`, data);
  }

  deleteArticle(id:number)
  {
    return this.http.delete(`api/articles/delete/${id}`);
  }

  updateArticle(id:number, data: FormData)
  {
    return this.http.put(`api/articles/update/${id}`, data);
  }
}
