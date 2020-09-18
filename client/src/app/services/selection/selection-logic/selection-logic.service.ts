import { Injectable } from '@angular/core';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { SketchService } from '@services/sketch/sketch.service';
import { ToolService } from '@services/tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionLogicService {

  elementSVG: HTMLElement;
  elementSelected: HTMLElement[];
  init: Point2d;
  final: Point2d;
  center: Point2d;
  finalSelect: Point2d;
  initSelect: Point2d;
  hasAlreadyBeenSelected: (element: HTMLElement) => boolean;
  eventMemory: MouseEvent;
  elementTargeted: HTMLElement;
  elementActionG: HTMLElement;

  constructor(
    public tool: ToolService,
    public sketch: SketchService,
  ) {
    // tslint:disable-next-line: arrow-return-shorthand
    this.hasAlreadyBeenSelected = (ele: HTMLElement) => { return (this.elementSelected.indexOf(ele) !== CST.NOT_IN_THE_ARRAY); };
    this.initialize();
    this.clearSelectedElement();
    this.finalSelect = new Point2d();
    this.finalSelect = new Point2d();
  }

  clearSelectedElement(): void {
    if (this.elementSelected !== undefined) {
      this.elementSelected.forEach((element: HTMLElement) => element.setAttribute('class', 'toolMark'));
    }
    this.elementSelected = new Array<HTMLElement>();
  }

  initialize(): void {
    this.init = new Point2d(Infinity, Infinity);
    this.final = new Point2d(-Infinity, -Infinity);
  }

  // http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
  // tslint:disable-next-line: no-any
  isEquivalent(a: any, b: any): boolean {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  getZone(width: number, height: number): number {
    if (width > 0 && height > 0) {
      return CST.ZONE_1;
    } else if (width > 0 && height < 0) {
      return CST.ZONE_2;
    } else if (width < 0 && height < 0) {
      return CST.ZONE_3;
    } else {
      return CST.ZONE_4;
    }
  }

  // Selection avec un RECTANGLE de Selection
  selectedByRectangle(): boolean { // T
    this.initialize();
    // tslint:disable-next-line: prefer-const
    let position: { pointA: Point2d, pointB: Point2d; } = {
      pointA: this.init,
      pointB: this.final
    };
    let elementHasBeenSelected: boolean;
    let isSomethingSelected = false;

    this.sketch.elementContainer.forEach((element) => {
      elementHasBeenSelected = true;
      const d: { max: number[], min: number[]; } = this.setDataElement(element);

      if (!(d.max[CST.X] < this.finalSelect.x) ||
        !(d.max[CST.Y] < this.finalSelect.y) ||
        !(this.initSelect.x < d.min[CST.X]) ||
        !(this.initSelect.y < d.min[CST.Y])) { elementHasBeenSelected = false; }
      if (elementHasBeenSelected && this.eventMemory.buttons === CST.MOUSE_SECONDARY_BUTTON && this.hasAlreadyBeenSelected(element)) {
        elementHasBeenSelected = false;
        this.removeElement(element);
        // element.setAttribute('class', 'toolMark');
      } else if (this.hasAlreadyBeenSelected(element)) {
        elementHasBeenSelected = true;
      }

      if (elementHasBeenSelected) {
        if (this.eventMemory.buttons === CST.MOUSE_PRIMARY_BUTTON) {
          elementHasBeenSelected = true;
          if (!this.hasAlreadyBeenSelected(element)) {
            this.elementSelected.push(element);
          }
        }
        if (this.eventMemory.buttons === CST.MOUSE_SECONDARY_BUTTON) {
          if (!this.hasAlreadyBeenSelected(element)) {
            elementHasBeenSelected = true;
            this.elementSelected.push(element);
          } else {
            elementHasBeenSelected = true;
          }
        }
        // element.setAttribute('class', 'toolMarkSelected');
        isSomethingSelected = true;
        this.updatePositionElement(position, d);
      }
    });

    if (isSomethingSelected) {
      this.rectangleBorder(position);
    }

    return isSomethingSelected;
  }

  // Selection avec un CLICK
  selectedByClick(): boolean {
    this.initialize();
    // tslint:disable-next-line: prefer-const
    let position: { pointA: Point2d, pointB: Point2d; } = {
      pointA: this.init,
      pointB: this.final
    };
    let elementHasBeenSelected: boolean;
    let isSomethingSelected = false;

    this.sketch.elementContainer.forEach((element) => {
      elementHasBeenSelected = true;
      const d: { max: number[], min: number[]; } = this.setDataElement(element);
      if (!this.hasAlreadyBeenSelected(element)) { elementHasBeenSelected = false; }
      if (this.elementTargeted === element) {
        if (this.eventMemory.buttons === CST.MOUSE_SECONDARY_BUTTON && this.hasAlreadyBeenSelected(element)) {
          // Click Droit + Deja Selectionner + Element Targeted => Deselectionner
          elementHasBeenSelected = false;
          this.removeElement(element);
        } else {
          elementHasBeenSelected = true;
        }
      }

      if (elementHasBeenSelected) {
        if (this.elementTargeted === element) {
          if (this.eventMemory.buttons === CST.MOUSE_PRIMARY_BUTTON) {
            if (!this.hasAlreadyBeenSelected(element)) {
              // Click Gauche + Pas Selectionner + Element Targeted => Selectionner
              this.elementSelected.push(element);
            }
            // Click Gauche + Deja Selectionner + Element Targeted => Rien Faire
          }
          if (this.eventMemory.buttons === CST.MOUSE_SECONDARY_BUTTON) {
            // Click Droit + Pas Selectionner + Element Targeted => Selectionner
            this.elementSelected.push(element);
          }
        }
        // Click Droit + Deja Selectionner + Element Untargeted => Selectionner
        this.updatePositionElement(position, d);
        isSomethingSelected = true;
      }
    });
    if (isSomethingSelected) {
      this.rectangleBorder(position);
    }
    return isSomethingSelected;
  }

  updatePositionElement(
    position: { pointA: Point2d, pointB: Point2d; }, d: { min: number[], max: number[]; }
  ): { pointA: Point2d, pointB: Point2d; } {
    if (d.min[CST.X] < position.pointA.x) { position.pointA.x = d.min[CST.X]; }
    if (d.min[CST.Y] < position.pointA.y) { position.pointA.y = d.min[CST.Y]; }
    if (d.max[CST.X] > position.pointB.x) { position.pointB.x = d.max[CST.X]; }
    if (d.max[CST.Y] > position.pointB.y) { position.pointB.y = d.max[CST.Y]; }
    return position;
  }

  setDataElement(element: HTMLElement): { min: number[], max: number[]; } {
    return {
      min:
        [element.getBoundingClientRect().left - this.elementSVG.getBoundingClientRect().left,
        element.getBoundingClientRect().top - this.elementSVG.getBoundingClientRect().top],
      max:
        [element.getBoundingClientRect().right - this.elementSVG.getBoundingClientRect().left,
        element.getBoundingClientRect().bottom - this.elementSVG.getBoundingClientRect().top],
    };
  }

  rectangleBorder(position: { pointA: Point2d, pointB: Point2d; }): void {
    this.init = position.pointA;
    this.final = position.pointB;
    this.center = new Point2d((position.pointA.x + position.pointB.x) / 2, (position.pointA.y + position.pointB.y) / 2);
  }

  removeElement(element: HTMLElement): void {
    const index = this.elementSelected.indexOf(element);
    if (index !== CST.NOT_IN_THE_ARRAY) {
      this.elementSelected.splice(index, 1);
    }
  }

}
