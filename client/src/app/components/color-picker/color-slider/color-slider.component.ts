/* ============================= [COPYRIGHT ©]============================= */
/* L'algorithme des fonctions de  slider sont inspirés a l'aide des tutoriels de Lukas Marx */
/* Lien :https://malcoded.com/posts/angular-color-picker/?fbclid=IwAR1BAQ2sL228NgAUXyJsaNVbgi26PiYyMHbV3fyILBQeJzAbiPMfTtsQDU4 */
/* ======================================================================= */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {

  @ViewChild('canvasElmntChild', { static: false }) canvasElmntChild: ElementRef<HTMLCanvasElement>;
  // add reference to the canvas element for the color slider

  @Output() color: EventEmitter<string> = new EventEmitter();

  @Output()
  rColor: EventEmitter<string> = new EventEmitter(true);

  @Output()
  gColor: EventEmitter<string> = new EventEmitter(true);

  @Output()
  bColor: EventEmitter<string> = new EventEmitter(true);

  ctx: CanvasRenderingContext2D; /* declaring the context ctx to be used for the canvas element*/
  selectedHeight: number; // to be used to indicate the current color with a nob in the draw() method
  mousedown: boolean; // mousedown call function

  constructor() {
    this.mousedown = false;
    // tslint:disable: no-magic-numbers
    this.selectedHeight = 1;
  }

  ngAfterViewInit(): void {
    if (this.canvasElmntChild !== undefined) {
      this.ctx = this.canvasElmntChild.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.draw();
    }
  }

  draw(): void {

    if (!this.ctx) {
      this.ctx = this.canvasElmntChild.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    // getting width and height of canvas element to be used later
    const width = this.canvasElmntChild.nativeElement.width;
    const height = this.canvasElmntChild.nativeElement.height;

    // clearing the canvas Rect
    this.ctx.clearRect(0, 0, width, height);

    /* creating this rainbow-like effect for our color-slider */
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height); // fill the whole canvas so we pass it the height of the canvas

    // defining color stops
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    // fill hole canvas element with gradient as background
    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    // indicate the current color with a nob
    if (this.selectedHeight) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 3;
      this.ctx.rect(0, this.selectedHeight - 3, width, 15);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  // mouseMove call function
  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);

    }
  }

  // end up with our mousedown-property stuck on false if the user stops holding the mouse-button down.
  onMouseUp(evt: MouseEvent): void {
    this.mousedown = false;
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
    this.colorRGBFinder(rgbaColor);
  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data; // extract image data from context
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'; // convert image Data to rgba
  }

  colorRGBFinder(rgbaColor: string): void {
    if (this.color) { // check if variable color not empty

      // splitting the string

      const rgbTmp = rgbaColor.substring(5); // split from 5th position
      const splitted = rgbTmp.split(',', 3); // now r g b are on the table!

      // saving the parts of color
      const rTmp = splitted[0];
      this.rColor.emit(this.decToHex(rTmp));
      this.gColor.emit(this.decToHex(splitted[1]));
      this.bColor.emit(this.decToHex(splitted[2]));
    }
  }

  decToHex(decColor: string): string {
    return (+decColor).toString(16);
    // 16 for HEXADECIMAL
  }

}
