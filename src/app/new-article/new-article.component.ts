import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription, pairwise } from 'rxjs';
import { Attribute } from '../share/models/attribute';
import { Category } from '../share/models/category';
import { ArticlesService } from '../share/services/articles/articles.service';
import { CategoryService } from '../share/services/category.service';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { AttributesDialogComponent } from './components/attributes-dialog/attributes-dialog.component';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
import { NewArticleReq } from './models/new-article-req';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from './models/dialog-data.model';
import { CategoryState } from '../articles-overeview/models/category-state';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss']
})
export class NewArticleComponent implements OnDestroy, OnInit {

  categories: Category[]= []
  categoriesSub!: Subscription
  dialogResult: DialogData = {categoryName:undefined, accepted:false, attributes:[]}
  tFormGroup = new FormGroup({
    cat: new FormControl<number>(0, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required]),
    details: new FormControl('',),
    newArticle: new FormControl<boolean>(true, [Validators.required])
  });
  selectedCategory: string | null = null;
  prevSelected: string | null = null;
  preview: string[] = [];
  allImages: Map<string, File> = new Map<string, File>;
  createSub!: Subscription;
  sending: boolean = false;

  constructor(private sidebarService: SidebarService, private categoryService: CategoryService, private articleService: ArticlesService,
    private dialog: MatDialog, private snackBar: MatSnackBar) {
    sidebarService.disable();
  }

  ngOnInit(): void {
    console.log('on init new article');
    this.categoriesSub = this.categoryService.getCategories().subscribe({
      next:(value) => {
        this.categories = value;
      }
    })
  }

  ngOnDestroy(): void {
    console.log('on destroy');
    if (this.createSub) {
      this.createSub.unsubscribe();
    }
    if(this.categoriesSub)
    {
      this.categoriesSub.unsubscribe();
    }
  }

  test(): void {
    this.prevSelected = this.selectedCategory;
  }

  onOpened() {
    if (this.dialogResult && this.dialogResult.attributes.length > 0) {
      console.log("on opened");

      const dialogRef = this.dialog.open(WarningDialogComponent,
        { data: { message: "Ukoliko promjenite kategoriju, definisane osobine ce se obrisati. Zelite li nastaviti dalje?" } },
      );

      dialogRef.afterClosed().subscribe(result => {
        
        if (result && result === true) {
          this.dialogResult!.attributes.length = 0;
        }
      })
    }
  }

  onChanged() {
    if (this.dialogResult && this.dialogResult.attributes.length > 0) {
      console.log("on changed");
      const dialogRef = this.dialog.open(WarningDialogComponent,
        { data: { message: "Ukoliko promjenite kategoriju, definisane osobine ce se obrisati. Zelite li nastaviti dalje?" } },
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result && result === true) {
          this.dialogResult!.attributes.length = 0;
        }
        else {
          this.selectedCategory = this.prevSelected;
        }
      })
    }
  }

  openDialog(): void {
    if (this.selectedCategory) {
      this.dialogResult.categoryName = this.selectedCategory;
      console.log(this.dialogResult.categoryName);
      const dialogRef = this.dialog.open(AttributesDialogComponent, {
        data: this.dialogResult,
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result === true) {
          //this.dialogResult = result;
        }
      });
    }
  }

  selectFile(event: any): void {
    if (event.target.files) {
      const file: File | null = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview.push(e.target.result);
          this.allImages.set(e.target.result, file);
        }
        reader.readAsDataURL(file);

      }
    }
  }

  removeImage(item: string): void {
    this.allImages.delete(item);
    this.preview = this.preview.filter(s => s != item);
  }

  validAttributes():CategoryState[]
  {
    if(this.dialogResult.categoryName==null)
    {
      return []
    }
    else
    {
      return this.dialogResult.attributes.filter(a => a.value!=null && a.value!=='');
    }
  }

  submit(): void {
    if (this.tFormGroup.valid) {
      let data = new FormData();
      let newArt: NewArticleReq = {
        title: this.tFormGroup.controls['title'].value!,
        price: this.tFormGroup.controls['price'].value!,
        details: this.tFormGroup.controls['details'].value!,
        categoryName: this.selectedCategory!,
        isNew: this.tFormGroup.controls['newArticle'].value!,
        attributes: this.validAttributes().map(a => {
          let attribute:Attribute = {name: a.viewName, value:a.value!, id:null}
          return attribute;
        })
      };
      const blob = new Blob([JSON.stringify(newArt)], {
        type: 'application/json'
      });
      data.append('newArticle', blob);
      [...this.allImages.entries()].forEach(([key, file], index) => {
        data.append(`photos`, file);
      });
      this.sending = true;
      this.createSub = this.articleService.createArticle(data).subscribe({
        next: (v) => {
          this.snackBar.open("Artikal uspjesno dodan!", "U redu", { duration: 3000 });
        },
        error: (err) => {
          this.sending = false;
          this.snackBar.open("Greska pri dodavanju artikla!", "U redu", { duration: 3000 });
        },
        complete: () => { this.sending = false; }
      }
      )
    }
  }
}

