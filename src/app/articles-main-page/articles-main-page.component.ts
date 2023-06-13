import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticlesService } from '../share/services/articles/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { FilterService } from '../share/services/filter/filter.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../share/services/category.service';
import { Subscription } from 'rxjs';
import { FilterDialogComponent } from '../articles-overeview/components/filter-dialog/filter-dialog/filter-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-articles-main-page',
  templateUrl: './articles-main-page.component.html',
  styleUrls: ['./articles-main-page.component.css']
})
export class ArticlesMainPageComponent implements OnInit, OnDestroy {
  private articlesSub: Subscription | null = null;
  public page: any | null;
  currentPage: number =0;
  constructor(private articleService: ArticlesService, private route: ActivatedRoute, public spinnerService: SpinnerService,
    private categoryService: CategoryService, public filterService: FilterService, private router: Router, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.filterService.restartState();
    this.articlesSub = this.articleService.getAllArticles(null).subscribe({
      next: (value) => { this.page = value; }
    })
  }

  ngOnDestroy(): void {
    if (this.articlesSub != null) {
      this.articlesSub.unsubscribe();
    }
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
    console.log(event.pageIndex);
    this.currentPage = event.pageIndex;
    if(this.articlesSub)
    {
      this.articlesSub.unsubscribe();
    }
    this.articlesSub = this.articleService.getAllArticles(event.pageIndex)
    .subscribe({
      next:(value)=>{this.page = value}
    })
  }

}
