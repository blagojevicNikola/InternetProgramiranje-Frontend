import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Attribute } from 'src/app/share/models/attribute';
import { AttributeStructure } from 'src/app/share/models/attribute-structure';
import { AttributesService } from 'src/app/share/services/attributes/attributes.service';
import { SpinnerService } from 'src/app/share/services/spinner/spinner.service';
import { DialogData } from '../../models/dialog-data.model';
import { CategoryService } from 'src/app/share/services/category.service';
import { CategoryState } from 'src/app/articles-overeview/models/category-state';
import { SidebarService } from 'src/app/share/services/sidebar/sidebar.service';

@Component({
  selector: 'app-attributes-dialog',
  templateUrl: './attributes-dialog.component.html',
  styleUrls: ['./attributes-dialog.component.css']
})
export class AttributesDialogComponent implements OnInit {

  innerState: CategoryState[] = []
  attributeFormGroup = new FormGroup({
  })
  private categoryName!: string;

  constructor(private categoryService: CategoryService,
    private sidebarService: SidebarService,
    public spinnerService: SpinnerService,
    public dialogRef: MatDialogRef<AttributesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.sidebarService.disable();
  }


  ngOnInit(): void {
    this.categoryName = this.data.categoryName!;
    console.log(this.categoryName);
    if (this.data.attributes.length == 0) {
      this.categoryService.getOptions(this.categoryName).subscribe((data) => {
        for (let a of data) {
          this.innerState.push(a);
          console.log(a.viewName);

          this.attributeFormGroup.addControl(a.viewName, new FormControl(''));
        }
      });
    } else {
      for (let a of this.data.attributes) {
        this.innerState.push(a);
        this.attributeFormGroup.addControl(a.viewName, new FormControl(a.value));
      }
    }

  }

  onNoClick(): void {
    Object.keys(this.attributeFormGroup.controls).forEach(c => {
      let index = this.innerState.findIndex(a => a.viewName === c);
      if (index != -1) {
        let attIndex = this.data.attributes.findIndex(a => a.viewName===c)
        if(attIndex!= -1)
        {
          this.data.attributes[attIndex].value = (this.attributeFormGroup.get(c)?.value==''|| this.attributeFormGroup.get(c)?.value == null) ? undefined : this.attributeFormGroup.get(c)?.value;
        }else
        {
          this.data.attributes.push({
            content: this.innerState[index].content,
            viewName: this.innerState[index].viewName,
            value: this.attributeFormGroup.get(c)?.value,
            multivalue: this.innerState[index].multivalue,
            queryName: ""
          })
        }
      }
    })
    this.dialogRef.close(true);
  }
}
