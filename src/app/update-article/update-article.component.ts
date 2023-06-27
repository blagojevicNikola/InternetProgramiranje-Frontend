import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { ArticlesService } from '../share/services/articles/articles.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, concatMap, switchMap } from 'rxjs';
import { ArticleInfo } from '../review/models/article-info';
import { Category } from '../share/models/category';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../share/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../new-article/components/warning-dialog/warning-dialog.component';
import { AttributesDialogComponent } from '../new-article/components/attributes-dialog/attributes-dialog.component';
import { SpinnerService } from '../share/services/spinner/spinner.service';
import { NewArticleReq } from '../new-article/models/new-article-req';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../new-article/models/dialog-data.model';
import { CategoryState } from '../articles-overeview/models/category-state';
import { Attribute } from '../share/models/attribute';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.scss']
})
export class UpdateArticleComponent implements OnInit, OnDestroy {

  private articleSub!: Subscription;
  private updateSub?: Subscription;
  public articleInfo: ArticleInfo | null = null;
  existingPhotos: string[] = [];
  cates: Category[] = [];
  dialogResult: DialogData = { categoryName: undefined, accepted: false, attributes: [] }
  tFormGroup = new FormGroup({
    cat: new FormControl<string>('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required]),
    details: new FormControl('',),
    newArticle: new FormControl<boolean>(true, [Validators.required])
  });
  selectedCategory: string | null = null;
  prevSelected: string | null = null;
  preview: string[] = [];
  allImages: Map<string, File> = new Map<string, File>;
  sending: boolean = false;

  constructor(private sidebarService: SidebarService, private articleService: ArticlesService,
    public spinner: SpinnerService, private dialog: MatDialog, private categoryService: CategoryService,
    private snackBar: MatSnackBar, private route: ActivatedRoute) {
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
          ).pipe(switchMap((val) => {
            this.articleInfo = val;
            this.selectedCategory = this.articleInfo.articleTypeName;
            this.tFormGroup.patchValue({
              cat: this.articleInfo.articleTypeName,
              title: this.articleInfo.title,
              price: this.articleInfo.price,
              details: this.articleInfo.details,
              newArticle: this.articleInfo.isNew
            });
            this.existingPhotos = this.articleInfo.photos.map(s => { return s.url });
            return this.categoryService.getOptions(val.articleTypeName)
          }))
            .subscribe({
              next: (result) => {
                this.dialogResult.attributes = result;
                this.dialogResult.categoryName = this.articleInfo?.articleTypeName
                this.articleInfo?.attributes.forEach(a => {
                  let tmpIndex = this.dialogResult.attributes.findIndex(d => d.viewName === a.name);
                  if (tmpIndex != -1) {
                    this.dialogResult.attributes[tmpIndex].value = a.value;
                  }
                })
              }
            })
          // .subscribe({
          //   next: (value) => {
          //     this.articleInfo = value;
          //     this.selectedCategory = value.articleTypeName;
          //     this.tFormGroup.patchValue({
          //       cat: value.articleTypeId,
          //       title: value.title,
          //       price: value.price,
          //       details: value.details,
          //       newArticle: value.isNew
          //     });
          //     this.articleInfo.attributes.forEach(a => dialogResult)
          //     this.existingPhotos = value.photos.map(s => { return s.url });
          //   }
          // });
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
      console.log(this.selectedCategory)
      this.dialogResult.categoryName = this.selectedCategory;
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

  validAttributes(): CategoryState[] {
    if (this.dialogResult.categoryName == null) {
      return []
    }
    else {
      return this.dialogResult.attributes.filter(a => a.value != null && a.value !== '');
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
    if (this.updateSub) {
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
        categoryName: this.selectedCategory!,
        isNew: this.tFormGroup.controls['newArticle'].value!,
        attributes: this.validAttributes().map(a => {
          let attribute: Attribute = { name: a.viewName, value: a.value!, id: null }
          return attribute;
        })
      };
      const blob = new Blob([JSON.stringify(newArt)], {
        type: 'application/json'
      });
      data.append('newArticle', blob);
      [...this.allImages.entries()].forEach(([key, file], index) => {
        data.append(`newPhotos`, file);
      });
      const existinPhotosListBlob = new Blob([JSON.stringify(this.existingPhotos)],{type:'application/json'})
     
        data.append(`existingPhotos`, existinPhotosListBlob);
      
      this.updateSub = this.articleService.updateArticle(this.articleInfo?.id!, data).subscribe({
        next: () => {
          this.snackBar.open("Artikal uspjesno azuriran!", "U redu", { duration: 3000 });
        },
        error: () => {
          this.snackBar.open("Greska prilikom azuriranja artikla!", "U redu", { duration: 3000 });
        }
      });

    }
  }
}
