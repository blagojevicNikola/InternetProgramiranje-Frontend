import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TransitionCheckState } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit{

  orderBy:string="date"
  choosenDesc:boolean=true;
  submited:boolean=false;
  formFilters: FormGroup = new FormGroup({
    priceFrom: new FormControl<number|undefined>(undefined),
    priceTo:new FormControl<number|undefined>(undefined)
  });

  public constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {map:{[key:string]:string}}) { }

  ngOnInit(): void {
    this.formFilters.patchValue({priceFrom:this.data.map['priceFrom'], priceTo:this.data.map['priceTo']});
    if(this.data.map['sort']!==undefined && this.data.map['sort'].match('^(date|price),(asc|desc)$'))
    {
      var tmp = this.data.map['sort'].split(',');
      this.orderBy=tmp[0];
      if(tmp[1]==='asc')
      {
        this.choosenDesc=false;
      }
      else{
        console.log("|"+tmp[1]+"|")
        this.choosenDesc=true;
      }
    }
  }

  
  submit()
  {
    if(this.formFilters.get('priceFrom')?.value!==undefined)
    {
      this.data.map['priceFrom'] = this.formFilters.get('priceFrom')?.value!

    }
    if(this.formFilters.get('priceTo')?.value!==undefined)
    {
      this.data.map['priceTo'] = this.formFilters.get('priceTo')?.value!

    }
    let dir = undefined;
    if(this.choosenDesc===true)
    {
      dir="desc";
      console.log("TAPP")
    }
    else{
      dir="asc"
    }
    this.data.map['sort'] = this.orderBy+','+dir;
    this.dialogRef.close(true);
  }

}
