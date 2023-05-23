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
      let tmpValue = this.data.existingAttributes.find(value => value.name===a.name)?.value;
      this.attributeFormGroup.addControl(a.name, new FormControl(tmpValue===undefined ? "" : tmpValue));
    }
    });
  }

  onNoClick(): void {
    Object.keys(this.attributeFormGroup.controls).forEach(c =>{
      if(this.attributeFormGroup.get(c)?.value.length>0)
      {
        let attTmp = this.dialogResult.attributes.find(f => f.name===c);
        if(attTmp===undefined)
        {
          this.dialogResult.attributes.push({id: null, name:c, value: this.attributeFormGroup.get(c)?.value});
        }
        else
        {
          attTmp.value=this.attributeFormGroup.get(c)?.value;
        }
      }
    });
    this.dialogResult.accepted = true;
    this.dialogRef.close(this.dialogResult);
  }
}
