import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, shareReplay } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  getCategories$ = this.http.get<Category[]>('/api/article-types').pipe(
    shareReplay(1),
  )


  constructor(private http: HttpClient) {

  }

  getCategories() {
    return this.http.get<Category[]>('/api/article-types');
  }

}
