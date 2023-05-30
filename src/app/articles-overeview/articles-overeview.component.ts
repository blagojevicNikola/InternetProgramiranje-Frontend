import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, } from 'rxjs';
import { Article } from '../share/models/article';
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
  private categorySub:Subscription|null = null;
  //articles: Article[] | null = [];
  page: any | null;
  //numOfArticles: number | undefined;
  //nameOfArticleType: string | null = "";
  //loading: boolean = false;
  currentPage: number = 0;
  //filtersState: { [key: string]: string } = {};
  paramSub: Subscription | null = null;
  querySub: Subscription | null = null;
  name: string | null = null;
  categoryState:CategoryState[]=[]

  constructor(private articleService: ArticlesService, private route: ActivatedRoute, public spinnerService: SpinnerService,
    private categoryService:CategoryService, public filterService:FilterService, private router: Router, private dialog: MatDialog) { }


  ngOnInit(): void {
    console.log('ispis');
    this.getArticles();
  }

  private getArticles() {
    this.paramSub = this.route.paramMap.subscribe((value) => {
      console.log('paramMap');
      this.filterService.restartState();
      //this.filtersState = {}
      this.name = value.get('name');
      if(this.categorySub)
      {
        this.categorySub.unsubscribe();
      }
      if(this.name!=null)
      {
        this.categorySub = this.categoryService.getOptions(this.name!).subscribe({
          next:(value) => {
            this.categoryState = value;
            this.filterService.setState(value);
          }
        })
      }
      this.unsubscribeFromArticles()
      if (this.name === null) {
        this.subscribtion = this.articleService.getAllArticles(this.filterService.getHttpParam()).subscribe((data) => { this.page = data });
      }
      else {
        this.subscribtion = this.articleService.getArticlesByType(this.name, this.filterService.getHttpParam()).subscribe((data) => { this.page = data });
      }
    })
    this.querySub = this.route.queryParams.subscribe((val) => {
      console.log('queryMap');
      this.filterService.restartState();
      this.filterService.setState(this.categoryState);
      this.filterService.setParam(val);
      this.unsubscribeFromArticles()
      if (this.name == null) {
        this.subscribtion = this.articleService.getAllArticles(this.filterService.getHttpParam()).subscribe((data) => { this.page = data });
      }
      else
      {
        this.subscribtion = this.articleService.getArticlesByType(this.name, this.filterService.getHttpParam()).subscribe((data) => { this.page = data });
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
    this.unsubscribeFromArticles();
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
    if(this.categorySub)
    {
      this.categorySub.unsubscribe();
    }
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
          this.router.navigate([`category/${this.name}`], { queryParams: this.filterService.getUrlQuery()})
        }
        else {
          this.router.navigate([`/`], { queryParams: this.filterService.getUrlQuery() })
        }
      }
    })
  }

}
