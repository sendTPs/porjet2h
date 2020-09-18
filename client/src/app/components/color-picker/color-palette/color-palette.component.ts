/* ============================= [COPYRIGHT ©]============================= */
/* L'algorithme des fonctions de la palette sont inspirés a l'aide des tutoriels de Lukas Marx */
/* Lien :https://malcoded.com/posts/angular-color-picker/?fbclid=IwAR1BAQ2sL228NgAUXyJsaNVbgi26PiYyMHbV3fyILBQeJzAbiPMfTtsQDU4 */
/* ======================================================================= */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
  @Input()
  hue: string;

  @Output()
  color: EventEmitter<string> = new EventEmitter(true);

  @Output()
  rColor: EventEmitter<string> = new EventEmitter(true);

  @Output()
  gColor: EventEmitter<string> = new EventEmitter(true);

  @Output()
  bColor: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvasElmntChild', { static: false })
  canvasElmntChild: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  prevent: boolean;
  mousedown: boolean;
  selectedPosition: { x: number; y: number; };

  constructor(
    private drawingOptionService: DrawingOptionService
  ) {
    this.prevent = false;
    this.mousedown = false;
    this.selectedPosition = { x: 249, y: 1 };
  }

  ngAfterViewInit(): void {
    if (this.canvasElmntChild !== undefined) {
      this.ctx = this.canvasElmntChild.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.draw();
    }
  }

  draw(): void {
    // same steps as color slider components
    const width = this.canvasElmntChild.nativeElement.width;
    const height = this.canvasElmntChild.nativeElement.height;

    this.ctx.fillStyle = this.hue || 'rgba(255,0,0,1)';
    this.ctx.fillRect(0, 0, width, height);

    const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.ctx.fillStyle = whiteGrad;
    this.ctx.fillRect(0, 0, width, height);

    const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.ctx.fillStyle = blackGrad;
    this.ctx.fillRect(0, 0, width, height);

    if (this.selectedPosition) {
      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        // tslint:disable: no-magic-numbers
        10,
        0,
        2 * Math.PI
      );
      this.ctx.lineWidth = 5;
      this.ctx.stroke();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hue) {
      this.ngAfterViewInit();
      const pos = this.selectedPosition;
      if (pos && this.prevent) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
        this.colorRGBFinder(this.getColorAtPosition(pos.x, pos.y));
      }
      this.prevent = true;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.draw();
    this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    this.colorRGBFinder(this.getColorAtPosition(evt.offsetX, evt.offsetY));
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
    this.colorRGBFinder(rgbaColor);

  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    );
  }

  /* function colorRGBFinder: split the color string into separate substrings that countains R G and B values from an RGBA() string
 @params: x: number, y: number
 @return : none but emits in variables rColor  gColor and bColor
*/
  colorRGBFinder(rgbaColor: string): void {

    if (this.color) { // check if variable color not empty

      // splitting the string

      const rgbTmp = rgbaColor.substring(5); // split from 5th position
      const splitted = rgbTmp.split(',', 3); // now r g b are on the table!

      // saving the parts of color
      const rTmp = splitted[0];
      this.rColor.emit(this.decToHex(rTmp)); this.drawingOptionService.rColorFromPicker = this.decToHex(rTmp);
      this.gColor.emit(this.decToHex(splitted[1])); this.drawingOptionService.gColorFromPicker = this.decToHex(splitted[1]);
      this.bColor.emit(this.decToHex(splitted[2])); this.drawingOptionService.bColorFromPicker = this.decToHex(splitted[2]);
    }
  }

  decToHex(decColor: string): string {
    return (+decColor).toString(16);
    // 16 for HEXADECIMAL
  }
}
