import { Injectable } from '@angular/core';

import { CommandService } from '@services/command/command.service';
import { SketchService } from '@services/sketch/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class CommandDrawingService extends CommandService {

  SVG: HTMLElement;
  canvas: HTMLElement;
  constructor(
    public sketch: SketchService,
    SVG: HTMLElement,
    canvas: HTMLElement
  ) {
    super();
    this.SVG = SVG;
    this.canvas = canvas;
  }

  execute(): void {
    this.canvas.appendChild(this.SVG);
    this.sketch.add(this.SVG);
  }

  remove(): void {
    this.canvas.removeChild(this.SVG);
    this.sketch.delete(this.SVG);
  }
}
