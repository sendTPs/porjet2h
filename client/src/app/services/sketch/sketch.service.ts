import { ElementRef, Injectable } from '@angular/core';

import * as CST from '@models/constants';

@Injectable({
  providedIn: 'root'
})
export class SketchService {

  elementSVG: HTMLElement;
  addCommand: boolean;
  elementContainer: HTMLElement[];
  // tslint:disable-next-line: no-any
  basicElemSVG: ElementRef<any>;

  constructor() {
    this.elementContainer = new Array<HTMLElement>();
    this.addCommand = false;
  }

  add(ele: HTMLElement): void {
    this.elementContainer.push(ele);
    this.addCommand = true;
  }

  remove(): void {
    this.elementContainer.pop();
    this.addCommand = false;
  }

  delete(element: HTMLElement): void {
    const index = this.elementContainer.indexOf(element);
    if (index === CST.NOT_IN_THE_ARRAY) { console.log('pas de remove'); return; }
    this.elementContainer[index] = this.elementContainer.pop() as HTMLElement;
    this.addCommand = false;
  }

  clear(): void {
    this.elementContainer = new Array<HTMLElement>();
    this.addCommand = false;
  }

}
