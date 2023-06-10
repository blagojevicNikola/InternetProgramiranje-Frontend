import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from 'src/app/review/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }


  public postComment(articleId:number, content:string)
  {
    return this.http.post<Comment|null>(`/api/comments/add/${articleId}`, content);
  }
}
