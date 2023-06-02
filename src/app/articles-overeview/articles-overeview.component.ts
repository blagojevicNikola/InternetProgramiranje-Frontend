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

  private subscribtion!: Subscription;
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
    this.navigatedByApp();
    return;
  }

  private navigatedByApp() {
    let combineObs = combineLatest([this.route.paramMap, this.route.queryParamMap]);
    this.paramSub = combineObs.subscribe(([params, queries]) => {
      this.internalFetch(params, queries)
    })
  }

  private navigatedByUrl() {
    let params = this.route.snapshot.paramMap;
    let queries = this.route.snapshot.queryParamMap;
    this.internalFetch(params, queries);
  }

  private internalFetch(params: ParamMap, queries: ParamMap) {

    let tmpName = params.get('name');
    if (tmpName == null) {
      this.name = null;
      this.filterService.restartState();
      this.filterService.setParam(queries);
      this.categoryState = this.filterService.attrState;
      this.categorySub = this.articleService.getAllArticles(this.filterService.getHttpParam())
        .subscribe({
          next: (value) => {
            this.page = value;
          }
        });
      return;
    }
    if (tmpName !== this.name) {
      this.name = tmpName;
      this.categorySub = this.categoryService.getOptions(this.name!).pipe(switchMap((response: CategoryState[]) => {
        this.filterService.restartState();
        this.filterService.restartSearch();
        this.filterService.setState(response);
        this.categoryState = response;
        this.filterService.setParam(queries);
        return this.articleService.getArticlesByType(this.name!, this.filterService.getHttpParam());
      })).subscribe({
        next: (value) => {
          this.page = value;
        }
      });
      // this.categorySub = concat(this.categoryService.getOptions(this.name!).pipe(map((result)=> ({typeResult1:result}))), 
      // this.articleService.getArticlesByType(this.name!, this.filterService.getHttpParam()).pipe(map((result)=> ({typeResult2:result}))))
      // .subscribe({
      //   next:(value) => {
      //     if ('typeResult1' in value && 'typeResult2' in value) {
      //       const type1Result: CategoryState[] = value.typeResult1;
      //       const type2Result = value.typeResult2;
      //       this.filterService.restartState();
      //       this.filterService.setState(type1Result);
      //       if(Object.keys(queries).length>0)
      //       {
      //         this.filterService.setParam(queries);
      //       }
      //       this.page = type2Result;
      //     }
      //   }
      // });
      return;
    }
    this.filterService.setParam(queries);
    this.categorySub = this.articleService.getArticlesByType(this.name!, this.filterService.getHttpParam())
      .subscribe({
        next: (value) => {
          this.page = value;
        }
      })
  }

  private unsubscribeFromArticles() {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }

  // private loadPage() {
  //   if (this.subscribtion) {
  //     this.subscribtion.unsubscribe();
  //   }
  //   this.getArticles();
  // }




  ngOnDestroy(): void {
    // this.unsubscribeFromArticles();
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
    console.log('ispis');

  }

  onPageChange(event: PageEvent) {
    // this.currentPage = event.pageIndex;
    this.filterService.setPageNo(event.pageIndex);
    if (this.name != null) {
      this.router.navigate([`category/${this.name}`], { queryParams: this.filterService.getUrlQuery() })
    }
    else {
      this.router.navigate([`/`], { queryParams: this.filterService.getUrlQuery() })
    }
  }

  onFilter() {
    const dialogRef = this.dialog.open(FilterDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.name !== null) {
          this.router.navigate([`category/${this.name}`], { queryParams: this.filterService.getUrlQuery() })
        }
        else {
          this.router.navigate([`/`], { queryParams: this.filterService.getUrlQuery() })
        }
      }
    })
  }

}
