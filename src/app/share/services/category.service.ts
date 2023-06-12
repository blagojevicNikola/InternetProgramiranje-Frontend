import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, catchError, shareReplay } from 'rxjs';
import { Category } from '../models/category';
import { CategoryState } from 'src/app/articles-overeview/models/category-state';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesData$: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  private cachedData: Category[] | null = null;

  constructor(private http: HttpClient) {

  }

  getCategories() {
    if(this.cachedData)
    {
      return this.categoriesData$.asObservable();
    }
    else
    {
      this.http.get<Category[]>('/api/article-types').subscribe(
        (data: Category[]) => {
          this.cachedData = data;
          this.categoriesData$.next(data);
        },
        (error: any) => {
          // Handle error if needed
        }
      );
    return this.categoriesData$.asObservable();
    }
  }

  getOptions(name:string)
  {
    return this.http.get<CategoryState[]>(`/api/article-types/${name}/options`);
  }

}
