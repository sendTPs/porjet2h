
import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  hasSketch: boolean;
  height: number;
  width: number;
  wantToContinue: boolean;
  svgElement: ElementRef<HTMLElement>;

  constructor() {
    this.hasSketch = false;
    this.wantToContinue = true;
    if (localStorage.length !== 0) {
      this.hasSketch = true;
    }
  }

  save(element?: ElementRef<HTMLElement>, height?: number, width?: number): void {

    if (element) {
      this.svgElement = element as ElementRef<HTMLElement>;
      this.height = height as number;
      this.width = width as number;
      window.localStorage.setItem('height', this.height.toString());
      window.localStorage.setItem('width', this.width.toString());
    }
    window.localStorage.setItem('svg', this.svgElement.nativeElement.innerHTML);
    this.hasSketch = true;

  }

  restoreBackup(): string {
    return localStorage.getItem('svg') as string;
  }

  restoreHeight(): number {
    return parseInt(localStorage.getItem('height') as string, 10);
  }

  restoreWidth(): number {
    return parseInt(localStorage.getItem('width') as string, 10);
  }
}
