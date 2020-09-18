import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { O_KEY } from '@models/constants';

import { BackupService } from '@app/services/backup/backup.service';
import { NewDrawingDialogComponent } from './new-drawing-dialog/new-drawing-dialog.component';

@Component({
  selector: 'app-new-drawing',
  templateUrl: 'new-drawing.component.html',
  styleUrls: ['./new-drawing.component.scss']
})
export class NewDrawingComponent {

  @ViewChild('b0', { static: true })
  b0: HTMLElement;

  width: number;
  height: number;
  backgroundColor: string;
  activeDialog: boolean;
  dialogRef: MatDialogRef<NewDrawingDialogComponent>;

  constructor(public dialog: MatDialog, public backup: BackupService) { }

  openDialog(): void {
    this.backup.wantToContinue = false;
    if (!this.activeDialog) {

      this.activeDialog = true;
      this.dialogRef = this.dialog.open(NewDrawingDialogComponent, {
        width: '500px',
        height: '700px',
        data: {
          // tslint:disable-next-line: no-magic-numbers
          width: document.body.clientWidth - 100, height: document.body.clientHeight - 30,
          hexCode: 'FFFFFF', colorR: '255', colorG: '255', colorB: '255'
        }
      });

      this.dialogRef.afterClosed().subscribe((result) => {
        this.activeDialog = false;
        this.backup.wantToContinue = true;
      });
    }

  }

  onButton(ele: HTMLElement): void {
    ele.style.backgroundColor = 'grey';
  }

  outButton(ele: HTMLElement): void {
    ele.style.backgroundColor = 'white';
  }

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === O_KEY) {
      this.openDialog();
      event.preventDefault();
    }
  }
}
