import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogData, NewDrawingDialogComponent } from '../new-drawing-dialog/new-drawing-dialog.component';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  openConfig(): void {
    this.dialogRef.close();
    this.dialog.open(NewDrawingDialogComponent, {
      width: '500px',
      height: '700px',
      data: {
        // tslint:disable-next-line: no-magic-numbers
        width: document.body.clientWidth - 100, height: document.body.clientHeight - 30,
        hexCode: 'FFFFFF', colorR: '255', colorG: '255', colorB: '255'
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { /*  */ }
}
