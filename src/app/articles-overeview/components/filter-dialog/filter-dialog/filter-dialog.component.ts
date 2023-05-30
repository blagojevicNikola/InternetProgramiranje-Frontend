import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TransitionCheckState } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryState } from 'src/app/articles-overeview/models/category-state';
import { FilterService } from 'src/app/share/services/filter/filter.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {

  orderBy: string = "date"
  choosenDesc: boolean = true;
  submited: boolean = false;
  formFilters: FormGroup = new FormGroup({
    priceFrom: new FormControl<number | undefined>(undefined),
    priceTo: new FormControl<number | undefined>(undefined)
  });
  attFormGroup: FormGroup = new FormGroup({})
  public constructor(public dialogRef: MatDialogRef<FilterDialogComponent>, public filterService: FilterService) { }

  ngOnInit(): void {
    this.formFilters.patchValue({ priceFrom: this.filterService.priceFromState.value, priceTo: this.filterService.priceToState.value });
    this.orderBy = this.filterService.sortState.sort;
    if (this.filterService.sortState.direction === 'asc') {
      this.choosenDesc = false;
    }
    else {
      this.choosenDesc = true;
    }
    for(const key of this.filterService.attrState)
    {
      console.log(key.viewName);
      this.attFormGroup.addControl(key.queryName, new FormControl(key.value));
    }
  }


  submit() {


    if (this.formFilters.get('priceFrom')?.value != null || this.formFilters.get('priceFrom')?.value !='') {
      this.filterService.priceFromState.value = this.formFilters.get('priceFrom')?.value
    }
    if (this.formFilters.get('priceTo')?.value != null || this.formFilters.get('priceTo')?.value !='') {
      this.filterService.priceToState.value = this.formFilters.get('priceTo')?.value
    }
    this.filterService.sortState.sort = this.orderBy;
    if (this.choosenDesc === true) {
      this.filterService.sortState.direction = "desc";
    }
    else {
      this.filterService.sortState.direction = "asc"
    }
    let resultState:CategoryState[] = []
    Object.keys(this.attFormGroup.controls).forEach((cont)=>{
      if(this.attFormGroup.get(cont)?.value !=null)
      {
        let tmp = this.filterService.attrState.findIndex((a) => a.viewName===cont)
        if(tmp !=null)
        {
          this.filterService.attrState[tmp].value = this.attFormGroup.get(cont)?.value;
        }
      }
    })
    this.dialogRef.close(true);
  }

}
