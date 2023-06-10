import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { MatStepper } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticlesService } from '../share/services/articles/articles.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy{

  //payingOptions:string[] = ['card', 'arrival'];
  selectedOption!:string;
  paySub:Subscription|null = null;
  private articleId!:number;
  successfullyPayed:boolean = false;
  paymentGroup:FormGroup = new FormGroup({
    payment: new FormControl<string>('', [Validators.required])
  })

  cardGroup:FormGroup = new FormGroup({
    card: new FormControl<string>('', [Validators.required])
  })

  arriveGroup: FormGroup = new FormGroup({
    arrive: new FormControl<string>('', [Validators.required])
  })

  hide = true;


  constructor(private sidebarService:SidebarService, private articleService:ArticlesService, private route:ActivatedRoute, private snackBar:MatSnackBar)
  {
    this.sidebarService.disable();
  }
  

  ngOnInit(): void {
    this.selectedOption = 'card';
    this.route.paramMap.subscribe((params)=>{
      if(params && params.get('id')!=null)
      {
        this.articleId = +params.get('id')!
      }
    })
  }

  onBuy()
  {
    this.paySub = this.articleService.buyAnArticle(this.articleId).subscribe({
      next:()=>{
        this.snackBar.open('Article bought successfully!', 'Okay', {duration:3000});
        this.successfullyPayed = true;
      },
      error:()=>{
        this.snackBar.open('Error!', 'Okay', {duration:3000});
      }
    })
  }

  ngOnDestroy(): void {
    if(this.paySub)
    {
      this.paySub.unsubscribe();
    }
  }

}
