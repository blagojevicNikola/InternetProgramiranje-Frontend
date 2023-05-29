import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {  Subscription, } from 'rxjs';
import { Article } from '../share/models/article';
import { ArticlesService } from '../share/services/articles/articles.service';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit, OnDestroy {

  private subscribtion!: Subscription;
  //articles: Article[] | null = [];
  page: any | null;
  //numOfArticles: number | undefined;
  //nameOfArticleType: string | null = "";
  //loading: boolean = false;
  currentPage: number = 0;
  filtersState: { [key: string]: string } = {};
  paramSub: Subscription | null = null;
  querySub: Subscription | null = null;
  name: string | null = null;

  constructor(private articleService: ArticlesService, private route: ActivatedRoute, public spinnerService: SpinnerService,
    private router: Router, private dialog: MatDialog) { }


  ngOnInit(): void {
    console.log('ispis');
    this.getArticles();
  }

  private getArticles() {
    this.paramSub = this.route.paramMap.subscribe((value) => {
      this.filtersState = {}
      this.name = value.get('name');
      this.unsubscribeFromArticles()
      if (this.name === null) {
        this.subscribtion = this.articleService.getAllArticles(this.filtersState).subscribe((data) => { this.page = data });
      }
      else {
        this.subscribtion = this.articleService.getArticlesByType(this.name, this.filtersState).subscribe((data) => { this.page = data });
      }
    })
    this.querySub = this.route.queryParams.subscribe((val) => {
      let br = 0;
      Object.keys(val).forEach((key) => { br++; this.filtersState[key] = val[key]! })
      if (this.name && br>0) {
        this.unsubscribeFromArticles()
        this.subscribtion = this.articleService.getArticlesByType(this.name, this.filtersState).subscribe((data) => { this.page = data });
        return;
      }
      if(this.name && br==0)
      {
        this.filtersState={};
        this.unsubscribeFromArticles()
        this.subscribtion = this.articleService.getArticlesByType(this.name, this.filtersState).subscribe((data) => { this.page = data });
        return;
      }
      if(this.name==null)
      {
        console.log("test");
        this.unsubscribeFromArticles()
        this.subscribtion = this.articleService.getAllArticles(this.filtersState).subscribe((data)=> {this.page = data});
      }
    })
  }

  private unsubscribeFromArticles()
  {
    if(this.subscribtion)
    {
      this.subscribtion.unsubscribe();
    }
  }

  private loadPage() {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
    this.getArticles();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromArticles();
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  onPageChange(event: PageEvent) {
    // this.currentPage = event.pageIndex;
    this.filtersState['pageNo'] = event.pageIndex.toString();
    this.loadPage();
  }

  onFilter() {
    const dialogRef = this.dialog.open(FilterDialogComponent, { data: { map: this.filtersState } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if(this.name!==null)
        {
          this.router.navigate([`category/${this.name}`], { queryParams: this.filtersState })
        }
        else
        {
          this.router.navigate([`/`], {queryParams:this.filtersState})
        }
      }
    })
  }

}
