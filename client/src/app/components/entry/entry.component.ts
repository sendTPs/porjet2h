
import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { BackupService } from '@app/services/backup/backup.service';
import { SketchService } from '@app/services/sketch/sketch.service';
import { GalleryComponent } from '@components/gallery/gallery.component';
import * as CST from '@models/constants';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {

  @ViewChild('b1', { static: true })
  b1: HTMLElement;

  @ViewChild('b2', { static: true })
  b2: HTMLElement;

  @ViewChild('b3', { static: true })
  b3: HTMLElement;

  constructor(public router: Router, public dialog: MatDialog, public backupService: BackupService, public sketchService: SketchService) { }

  protected hasSketch: boolean;

  openUserManual(): void {
    this.router.navigate(['/user-manual']);
  }

  openGallery(): void {
    this.dialog.open(GalleryComponent, {
      width: '1000px',
      height: '700px',
    });
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if (event.ctrlKey && event.key === CST.G_KEY) {
      this.openGallery();
      event.preventDefault();
    }
  }

  onButton(ele: HTMLElement): void {
    ele.style.backgroundColor = 'grey';
  }

  outButton(ele: HTMLElement): void {
    ele.style.backgroundColor = 'white';
  }

  checkSketch(): boolean {
    return this.backupService.hasSketch;
  }

  continueDrawing(): void {
    this.backupService.restoreBackup();
    this.backupService.wantToContinue = true;
    this.router.navigate(['/view']);
  }

}
