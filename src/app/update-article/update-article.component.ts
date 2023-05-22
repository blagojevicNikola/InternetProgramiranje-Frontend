import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { ArticlesService } from '../share/services/articles/articles.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, concatMap, switchMap } from 'rxjs';
import { ArticleInfo } from '../review/models/article-info';
import { Category } from '../share/models/category';
import { DialogResult } from '../new-article/models/dialog-result.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../share/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../new-article/components/warning-dialog/warning-dialog.component';
import { AttributesDialogComponent } from '../new-article/components/attributes-dialog/attributes-dialog.component';
import { SpinnerService } from '../share/services/spinner/spinner.service';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.css']
})
export class UpdateArticleComponent implements OnInit, OnDestroy {

  private articleSub!: Subscription;
  public articleInfo: ArticleInfo | null = null;
  cates:Category[] = [];
  //categories$: Observable<Category[]> = this.categoryService.getCategories$
  dialogResult: DialogResult | null = null;
  tFormGroup = new FormGroup({
    cat: new FormControl<number>(0),
    title: new FormControl('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required]),
    details: new FormControl('',),
    newArticle: new FormControl<boolean>(true, [Validators.required])
  });
  selectedCategory: number | null = null;
  prevSelected: number | null = null;
  preview: string[] = [];
  allImages: Map<string, File> = new Map<string, File>;
  sending: boolean = false;

  constructor(private sidebarService: SidebarService, private articleService: ArticlesService, 
    public spinner: SpinnerService, private dialog: MatDialog, private categoryService: CategoryService, private route: ActivatedRoute) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (param) => {
        let id = param.get('id');
        if(id)
        {
          this.articleSub = this.categoryService.getCategories().pipe(
            concatMap((result1) => {
              this.cates = result1;
              return this.articleService.getArticleInfo(+id!);
            })
          ).subscribe({
            next:(value) => {
              this.articleInfo = value;
              this.selectedCategory = value.articleTypeId;
              console.log(this.selectedCategory)
              this.tFormGroup.patchValue({
                cat:value.articleTypeId,
                title:value.title,
                price:value.price,
                details:value.details,
                newArticle:value.isNew
              });
            }});
        }
      }
    });
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

  removeImage(item: string): void {
    this.allImages.delete(item);
    this.preview = this.preview.filter(s => s != item);
  }


  ngOnDestroy(): void {
    if(this.articleSub)
    {
      this.articleSub.unsubscribe();
    }
  }

  submit()
  {

  }

}
function swtichMap(arg0: (value1: any) => Observable<ArticleInfo>) {
  throw new Error('Function not implemented.');
}

