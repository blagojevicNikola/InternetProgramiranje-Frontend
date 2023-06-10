import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router } from '@angular/router';
import { Observable, Subscription, combineLatest, concat, map, switchMap, } from 'rxjs';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog/filter-dialog.component';
import { CategoryState } from './models/category-state';
import { FilterService } from '../share/services/filter/filter.service';
import { CategoryService } from '../share/services/category.service';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit, OnDestroy {

  private articlesSub!: Subscription;
  private categorySub: Subscription | null = null;
  //articles: Article[] | null = [];
  page: any | null;
  //numOfArticles: number | undefined;
  //nameOfArticleType: string | null = "";
  //loading: boolean = false;
  currentPage: number = 0;
  //filtersState: { [key: string]: string } = {};
  paramSub: Subscription | null = null;
  routerSub: Subscription | null = null;
  name: string | null = null;
  categoryState: CategoryState[] = []

  constructor(private articleService: ArticlesService, private route: ActivatedRoute, public spinnerService: SpinnerService,
    private categoryService: CategoryService, public filterService: FilterService, private router: Router, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.filterService.restartState();
    this.articlesSub = this.route.paramMap.pipe(switchMap((params) => {
      this.name = params.get('name');
      const stream1$ = this.articleService.getArticlesByType(this.name);
      const stream2$ = this.categoryService.getOptions(this.name!);
      return combineLatest([stream1$, stream2$]);
    })).subscribe({
      next: ([value1, value2]) => {
        this.page = value1;
        this.filterService.setState(value2);
      }
    })
    return;
  }


  ngOnDestroy(): void {
    // this.unsubscribeFromArticles();
    if (this.articlesSub != null) {
      this.articlesSub.unsubscribe();
    }

  }

  onPageChange(event: PageEvent) {
    // this.currentPage = event.pageIndex;
    this.filterService.setPageNo(event.pageIndex);
    this.router.navigate([`${this.name}`], { queryParams: this.filterService.getUrlQuery() })
  }

  onFilter() {
    const dialogRef = this.dialog.open(FilterDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.filterService.setPageNo(0);
        this.filterService.setCategory(this.name!);
        this.router.navigate([`search`], { queryParams: this.filterService.getUrlQuery() })
      }
    })
  }

}
