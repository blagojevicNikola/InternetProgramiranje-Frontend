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
import { NewArticleReq } from '../new-article/models/new-article-req';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.css']
})
export class UpdateArticleComponent implements OnInit, OnDestroy {

  private articleSub!: Subscription;
  private updateSub?:Subscription;
  public articleInfo: ArticleInfo | null = null;
  existingPhotos: string[] = [];
  cates: Category[] = [];
  dialogResult: DialogResult ={accepted:false, attributes:[]}
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
    public spinner: SpinnerService, private dialog: MatDialog, private categoryService: CategoryService, 
    private snackBar:MatSnackBar, private route: ActivatedRoute) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (param) => {
        let id = param.get('id');
        if (id) {
          this.articleSub = this.categoryService.getCategories().pipe(
            concatMap((result1) => {
              this.cates = result1;
              return this.articleService.getArticleInfo(+id!);
            })
          ).subscribe({
            next: (value) => {
              this.articleInfo = value;
              this.selectedCategory = value.articleTypeId;
              this.tFormGroup.patchValue({
                cat: value.articleTypeId,
                title: value.title,
                price: value.price,
                details: value.details,
                newArticle: value.isNew
              });
              this.existingPhotos = value.photos.map(s => { return s.url });
              this.dialogResult.attributes = value.attributes
            }
          });
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
        data: { categoryId: this.selectedCategory, existingAttributes: this.dialogResult.attributes},
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

  removeExistingImage(item: string): void {
    this.existingPhotos = this.existingPhotos.filter(s => s != item);
  }


  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
    if(this.updateSub)
    {
      this.updateSub.unsubscribe();
    }
  }

  submit() {
    if (this.tFormGroup.valid) {
      let data = new FormData();
      let newArt: NewArticleReq = {
        title: this.tFormGroup.controls['title'].value!,
        price: this.tFormGroup.controls['price'].value!,
        details: this.tFormGroup.controls['details'].value!,
        categoryId: this.selectedCategory!,
        isNew: this.tFormGroup.controls['newArticle'].value!,
        attributes: this.dialogResult?.attributes!
      };
      const blob = new Blob([JSON.stringify(newArt)], {
        type: 'application/json'
      });
      data.append('newArticle', blob);
      [...this.allImages.entries()].forEach(([key, file], index) => {
        data.append(`newPhotos`, file);
      });
      this.existingPhotos.forEach(p => {
        data.append(`existingPhotos`, p);
      });
      this.updateSub = this.articleService.updateArticle(this.articleInfo?.id!, data).subscribe({
        next:() => {
          this.snackBar.open("Artikal uspjesno azuriran!", "U redu", {duration: 3000});
        },
        error:() => {
          this.snackBar.open("Greska prilikom azuriranja artikla!", "U redu", {duration:3000});
        }
      });
      
    }
  }
}
