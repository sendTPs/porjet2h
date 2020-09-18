import { Injectable } from '@angular/core';

import { DialogData } from '@components/new-drawing/new-drawing-dialog/new-drawing-dialog.component';
import { BackupService } from '../backup/backup.service';

@Injectable({
  providedIn: 'root'
})
export class DrawingOptionService {
  width: number;
  height: number;
  backgroundColor: string;
  hexCode: number;
  newDrawing: boolean;
  rColorFromPicker: string;
  gColorFromPicker: string;
  bColorFromPicker: string;

  constructor(public backupService: BackupService) {
    // tslint:disable: no-magic-numbers
    this.width = 750;
    this.height = 750;
    this.rColorFromPicker = 'ff';
    this.gColorFromPicker = 'ff';
    this.bColorFromPicker = 'ff';
    this.backgroundColor = '#ffffff';
    if (this.backupService.wantToContinue) {
      // tslint:disable: radix
      this.height = parseInt(localStorage.getItem('height') as string);
      this.width = parseInt(localStorage.getItem('width') as string);
      this.backgroundColor = localStorage.getItem('backgroundColor') as string;
    }

  }

  addToOption(data: DialogData): void {
    this.height = data.height;
    this.width = data.width;
    this.backgroundColor = data.backgroundColor;
    this.newDrawing = true;
  }

}
