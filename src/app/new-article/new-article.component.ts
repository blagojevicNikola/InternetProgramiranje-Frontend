import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { NewArticleReq } from './models/new-article-req';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnDestroy, OnInit {

  categories$: Observable<Category[]> = this.categoryService.getCategories$
  dialogResult: DialogResult | null = null;
  tFormGroup = new FormGroup({
    cat: new FormControl<number>(0, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required]),
    details: new FormControl('',),
    newArticle: new FormControl<boolean>(true, [Validators.required])
  });
  selectedCategory: number | null = null;
  prevSelected: number | null = null;
  preview: string[] = [];
  allImages: Map<string, File> = new Map<string, File>;

  constructor(private sidebarService: SidebarService, private categoryService: CategoryService, private dialog: MatDialog) {
    sidebarService.disable();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sidebarService.enable();
  }

  test(): void {
    this.prevSelected = this.selectedCategory;
  }

  onOpened() {
    if (this.dialogResult && this.dialogResult.attributes.length > 0) {
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
      const dialogRef = this.dialog.open(AttributesDialogComponent, {
        data: { categoryId: this.selectedCategory },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.accepted === true) {
          this.dialogResult = result;
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

  removeImage(item: string):void{
    this.allImages.delete(item);
    this.preview = this.preview.filter(s => s!=item);
  }

  submit(): void {
    if (this.tFormGroup.valid) {
      let data = new FormData();
      data.append('title', this.tFormGroup.controls['title'].value!);
      data.append('price', this.tFormGroup.controls['price'].value!.toString());
      data.append('details', this.tFormGroup.controls['details'].value!);
      data.append('categoryId', this.selectedCategory!.toString());
      data.append('isNew', String(this.tFormGroup.controls['newArticle'].value!));
      this.dialogResult?.attributes.forEach((a, index) => {
        data.append(`objects[${index}].name`,a.name);
        data.append(`objects[${index}].value`, a.value);
      });
      [...this.allImages.entries()].forEach(([key, file], index) => {
        data.append(`photos[${index}].key`, key);
        data.append(`photos[${index}].file`, file);
      });
      
    }
  }
}

