import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Attribute } from 'src/app/share/models/attribute';
import { AttributeStructure } from 'src/app/share/models/attribute-structure';
import { AttributesService } from 'src/app/share/services/attributes/attributes.service';
import { SpinnerService } from 'src/app/share/services/spinner/spinner.service';
import { DialogData } from '../../models/dialog-data.model';
import { DialogResult } from '../../models/dialog-result.model';

@Component({
  selector: 'app-attributes-dialog',
  templateUrl: './attributes-dialog.component.html',
  styleUrls: ['./attributes-dialog.component.css']
})
export class AttributesDialogComponent implements OnInit{

  attributes: AttributeStructure[] = [];
  dialogResult: DialogResult = {attributes: [], accepted: false}
  attributeFormGroup = new FormGroup({
    atts: new FormArray<FormControl>([])
  })

  constructor(private attributesService:AttributesService, 
    public spinnerService: SpinnerService,
    public dialogRef: MatDialogRef<AttributesDialogComponent>,
   @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }


  ngOnInit(): void {
    this.attributesService.getAttributeStructuresByArticleTypeId(this.data.categoryId).subscribe((data)=>{this.attributes=data
    for(let a of this.attributes)
    {
      this.attributeFormGroup.controls['atts'].push(new FormControl(null));
    }
    });
  }

  onNoClick(): void {
    for(let i=0; i < this.attributes.length; i++)
    {
      const val:string = this.attributes[i].name;
      if(this.attributeFormGroup.controls['atts'].controls[i].value)
      {
        this.dialogResult.attributes.push({name: val, value: this.attributeFormGroup.controls['atts'].controls[i].value})
      }
    }
    this.dialogResult.accepted = true;
    this.dialogRef.close(this.dialogResult);
  }
}
