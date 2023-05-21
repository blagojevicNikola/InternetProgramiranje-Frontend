import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.css']
})
export class ApproveDialogComponent {

  constructor(public dialogRef: MatDialogRef<ApproveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {message:string})
    {
      
    }

  onYesClick()
  {
    this.dialogRef.close(true);
  }

  onNoClick()
  {
    this.dialogRef.close(false);
  }
}
