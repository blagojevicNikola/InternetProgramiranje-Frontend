import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, pairwise } from 'rxjs';
import { Attribute } from '../share/models/attribute';
import { Category } from '../share/models/category';
import { ArticlesService } from '../share/services/articles/articles.service';
import { CategoryService } from '../share/services/category.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { AttributesDialogComponent } from './components/attributes-dialog/attributes-dialog.component';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
import { DialogResult } from './models/dialog-result.model';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnDestroy, OnInit {

  categories$: Observable<Category[]> = this.categoryService.getCategories$
  dialogResult: DialogResult | null = null;
  tFormGroup = new FormGroup({cat: new FormControl<number>(0)})
  selectedCategory: number | null = null;

  constructor(private sidebarService: SidebarService, private categoryService: CategoryService, private dialog: MatDialog) {
    sidebarService.disable();
  }

  ngOnInit(): void {
    this.tFormGroup.controls['cat'].valueChanges.pipe(pairwise()).subscribe(([prev, next]:[any, any])=> {
      if(this.dialogResult && this.dialogResult.attributes.length>0)
    {
      const dialogRef = this.dialog.open(WarningDialogComponent, {data: {message: "Da li zelite da obrisete prethodnu listu osobina?"}});
      
      dialogRef.afterClosed().subscribe(result => {
        if(result && result === true)
        {
          this.dialogResult!.attributes.length = 0;
        }
        else
        {
          this.selectedCategory = prev;
        }
      })
    }
    } )
  }

  ngOnDestroy(): void {
    this.sidebarService.enable();
  }

  test(): void{
    console.log(this.selectedCategory);
    console.log('-');
  }

  categoryChanged(){
    if(this.dialogResult && this.dialogResult.attributes.length>0)
    {
      const dialogRef = this.dialog.open(WarningDialogComponent, {data: {message: "Da li zelite da obrisete prethodnu listu osobina?"}});
      
      dialogRef.afterClosed().subscribe(result => {
        if(result && result === true)
        {
          this.dialogResult!.attributes.length = 0;
        }
      })
    }
  }

  openDialog(): void {
    if (this.selectedCategory) {
      const dialogRef = this.dialog.open(AttributesDialogComponent, {
        data: { categoryId: this.selectedCategory }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.accepted === true) {
          this.dialogResult = result;
        }
      });
    }
  }
}

