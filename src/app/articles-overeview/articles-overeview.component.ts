import { Component, OnInit } from '@angular/core';
import { Article } from '../share/models/article';

@Component({
  selector: 'app-articles-overeview',
  templateUrl: './articles-overeview.component.html',
  styleUrls: ['./articles-overeview.component.css']
})
export class ArticlesOvereviewComponent implements OnInit{

  articles: Article[] = [];
  numOfArticles:number | undefined;
  constructor()
  {

  }

  ngOnInit(): void {
    this.articles = [
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      },
      {
        id:1,
        title:'Naziv',
        price:123,
        description: 'opis'
      }
    ]  
  }

}
