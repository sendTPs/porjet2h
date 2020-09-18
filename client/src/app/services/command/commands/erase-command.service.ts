import { Injectable } from '@angular/core';
import { SketchService } from '../../sketch/sketch.service';
import { CommandService } from '../command.service';

@Injectable({
  providedIn: 'root'
})
export class CommandEraseService extends CommandService {

  constructor(
    public sketch: SketchService,
    public elements: HTMLElement[],
    public SVG: HTMLElement
  ) {
    super();
  }

  execute(): void {
    this.elements.forEach((element) => {
      this.SVG.removeChild(element);
      element.childNodes.forEach((object) => {
        this.sketch.delete(object as HTMLElement);
      });
    });
  }

  remove(): void { // remove = cancel
    this.elements.forEach((element) => {
      this.SVG.appendChild(element);
      element.childNodes.forEach((object) => {
        this.sketch.add(object as HTMLElement);
      });
    });
  }
}
