import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, combineLatest, switchMap } from 'rxjs';
import { ArticlesService } from '../share/services/articles/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../share/services/filter/filter.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { CategoryService } from '../share/services/category.service';
import { FilterDialogComponent } from '../articles-overeview/components/filter-dialog/filter-dialog/filter-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { __values } from 'tslib';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'app-articles-search-page',
  templateUrl: './articles-search-page.component.html',
  styleUrls: ['./articles-search-page.component.css']
})
export class ArticlesSearchPageComponent implements OnInit, OnDestroy {

  private articlesSub: Subscription | null = null;
  public page: any | null = null;

  constructor(private articleService: ArticlesService, private route: ActivatedRoute, public spinnerService: SpinnerService,
    private categoryService: CategoryService, public filterService: FilterService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next:(params)=>{
        let category = params['category'];
        console.log(params['Procesor'])
        this.filterService.restartState();
        if(category!=null)
        {
          this.articlesSub = this.categoryService.getOptions(category).pipe(switchMap((value)=>{
            this.filterService.setState(value);
            this.filterService.setParam(params);
            this.filterService.setCategory(category!);
            return this.articleService.getArticlesByQuery(this.filterService.getHttpParam());
          })).subscribe({
            next:(data)=>{
              this.page = data;
            }
          })
      }else{
        this.filterService.setParam(params);
        this.articlesSub = this.articleService.getArticlesByQuery(this.filterService.getHttpParam()).subscribe({
          next:(data)=>{
            this.page = data;
          }
        })
      }
      }
    })
  }

  onFilter() {
    const dialogRef = this.dialog.open(FilterDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.filterService.setPageNo(0);
        this.router.navigate([`search`], { queryParams: this.filterService.getUrlQuery() })
      }
    })
  }

  onPageChange(event: PageEvent) {
    // this.currentPage = event.pageIndex;
    this.filterService.setPageNo(event.pageIndex);
    this.router.navigate([`search`], { queryParams: this.filterService.getUrlQuery() })
  }

  ngOnDestroy(): void {
    if (this.articlesSub != null) {
      this.articlesSub.unsubscribe();
    }
  }
}
