import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BackupService } from '@app/services/backup/backup.service';
import * as CST from '@models/constants';
import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';

@Component({
  selector: 'app-new-drawing-dialog',
  templateUrl: './new-drawing-dialog.component.html',
  styleUrls: ['./new-drawing-dialog.component.scss']
})

export class NewDrawingDialogComponent implements OnInit {

  rColorFromPicker: string; // used to receive color from drawing service
  gColorFromPicker: string;
  bColorFromPicker: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public renderer: Renderer2,
    public newDrawingService: DrawingOptionService,
    public router: Router,
    public dialog: MatDialog,
    public newDrawingDialogRef: MatDialogRef<NewDrawingDialogComponent>,
    public backupService: BackupService,
  ) {
    this.rColorFromPicker = 'ff'; // used to receive color from drawing service
    this.gColorFromPicker = 'ff';
    this.bColorFromPicker = 'ff';
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.rColorFromPicker = this.newDrawingService.rColorFromPicker;
    this.gColorFromPicker = this.newDrawingService.gColorFromPicker;
    this.bColorFromPicker = this.newDrawingService.bColorFromPicker;
  }

  update(): void {
    this.init();
    this.data.backgroundColor = '#' + this.rColorFromPicker + this.gColorFromPicker + this.bColorFromPicker;
    this.newDrawingService.rColorFromPicker = 'ff';
    this.newDrawingService.gColorFromPicker = 'ff';
    this.newDrawingService.bColorFromPicker = 'ff';
    this.setDataInStorage();
  }
  setDataInStorage(): void {
    localStorage.clear();
    localStorage.setItem('height', this.data.height.toString());
    localStorage.setItem('width', this.data.width.toString());
    localStorage.setItem('backgroundColor', this.data.backgroundColor);
  }
  onNoClick(): void {
    this.newDrawingDialogRef.close();
  }

  onClick(): void {
    this.newDrawingDialogRef.close();
    this.update();
    this.newDrawingService.addToOption(this.data);
    this.router.navigate(['/view']);
  }

  onResize(event: EventHandlerNonNull): void {
    this.data.height = document.body.clientHeight - CST.ADJUST_HEIGHT;
    this.data.width = document.body.clientWidth - CST.ADJUST_WIDTH;
  }
}

export interface DialogData {
  width: number;
  height: number;
  colorR: number;
  colorG: number;
  colorB: number;
  hexCode: number;
  backgroundColor: string;
}
