import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@models/constants';

import { AttributeService } from '@services/attribute/attribute.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandEraseService } from '@services/command/commands/erase-command.service';
import { SketchService } from '@services/sketch/sketch.service';
import { ToolService } from '@services/tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class EraserService {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  erasingInProcess: boolean;
  pointExists: boolean;
  isMouseSquare: boolean;
  elementTargeted: HTMLElement;
  selectedElements: HTMLElement[];
  elementToCommand: HTMLElement[];
  mouseSquare: HTMLElement;

  constructor(
    public commandManager: CommandManagerService,
    public sketch: SketchService,
    public tool: ToolService,
    public width: AttributeService,
    protected renderFactory: RendererFactory2
  ) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.erasingInProcess = false;
    this.isMouseSquare = false;
    this.selectedElements = new Array<HTMLElement>();
    this.elementToCommand = new Array<HTMLElement>();
  }

  shortcut(): void { return; }

  start(event: MouseEvent): void {
    this.erasingInProcess = true;
    this.erasingElements(event);
  }

  eraseMarker(): void {
    this.isMouseSquare = false;
    if (this.mouseSquare !== undefined) { this.mouseSquare.remove(); }
  }

  end(): void {
    if (!this.erasingInProcess) { return; }
    if (this.selectedElements.length === 0) { return; }
    this.elementToCommand = new Array<HTMLElement>();
    this.selectedElements.forEach((element) => {
      element.setAttribute('class', 'toolMark');
      if (element.tagName !== 'polyline' && element.tagName !== 'path') {
        element.removeAttribute('class');
      }
      const parent = element.parentElement as HTMLElement;
      this.elementToCommand.push(parent);
      this.elementSVG.removeChild(parent);
      this.sketch.delete(element);
    });

    const command = new CommandEraseService(this.sketch, this.elementToCommand, this.elementSVG);
    this.commandManager.add(command);

    this.selectedElements = new Array<HTMLElement>();
    this.erasingInProcess = false;
  }

  draw(event: MouseEvent): void {
    if (!this.isMouseSquare) {
      this.createMouseSquare();
    }
    this.updateMouseSquare(event);
    if (!this.erasingInProcess) {
      this.elementTargeted = event.target as HTMLElement;
      this.sketch.elementContainer.forEach((element) => {
        if (this.elementTargeted === element || this.isSelectedElement(element, event)) {
          this.determineColor(element);
        } else {
          if (element.tagName === 'polyline' || element.tagName === 'path') {
            element.setAttribute('class', 'toolMark');
          } else {
            element.removeAttribute('class');
          }
        }
      });
    } else {
      this.erasingElements(event);
    }
  }

  erasingElements(event: MouseEvent): void {

    this.elementTargeted = event.target as HTMLElement;
    this.sketch.elementContainer.forEach((canvasElem) => {
      if ((this.elementTargeted === canvasElem || this.isSelectedElement(canvasElem, event))
        && !this.selectedElements.includes(canvasElem)) {
        this.selectedElements.push(canvasElem);
        this.determineColor(canvasElem);
      }
    });
  }

  isSelectedElement(element: HTMLElement, event: MouseEvent): boolean {
    const radius = parseInt(this.width.width, 10) / 2;
    const mesure = element.getBoundingClientRect();
    const leftBound = event.clientX - radius;
    const rightBound = event.clientX + radius;
    const topBound = event.clientY - radius;
    const bottomBound = event.clientY + radius;
    const left = event.offsetX - radius;
    const right = event.offsetX + radius;
    const top = event.offsetY - radius;
    const bottom = event.offsetY + radius;
    if (mesure.left > rightBound) {
      return false;
    }
    if (mesure.right < leftBound) {
      return false;
    }
    if (mesure.top > bottomBound) {
      return false;
    }
    if (mesure.bottom < topBound) {
      return false;
    }
    if (element.tagName === 'polyline' || element.tagName === 'polygon') {
      const points = (element.getAttribute('points') as string).split(' ').map((x) => x.split(','));
      return this.checkPoint(points, left, right, top, bottom);
    }
    if (element.tagName === 'path') {
      const points = (element.getAttribute('d') as string).replace('M', '').replace('L', '').split(' ').map((x) => x.split(','));
      return this.checkPoint(points, left, right, top, bottom);
    }
    return true;
  }

  checkPoint(points: string[][], left: number, right: number, top: number, bottom: number): boolean {
    let returnValue = false;
    points.forEach((i) => {
      const point = i.map((x) => parseInt(x, 10));

      if (left < point[CST.X] && point[CST.X] < right &&
        top < point[CST.Y] && point[CST.Y] < bottom) {
        returnValue = true;

      }
    });
    return returnValue;
  }

  determineColor(element: HTMLElement): void {

    const couleur = element.getAttribute('stroke');
    let isRed = false;
    if (couleur) {
      const cc = couleur.replace(/rgb/, '').replace(/a/, '').replace(/\(/, '').replace(/\)/, '');
      const tabcouleur = cc.split(',').map((x) => parseInt(x, 10));
      if (tabcouleur[1] / tabcouleur[0] < CST.RATIO_ROUGE_EFFACE && tabcouleur[2] / tabcouleur[0] < CST.RATIO_ROUGE_EFFACE) {
        isRed = true;
      }
    }

    if (element.tagName === 'polyline' || element.tagName === 'path') {
      if (isRed) {
        element.setAttribute('class', 'darkerRedLine');
      } else {
        element.setAttribute('class', 'eraserIndicatorLine');
      }
    } else {
      if (isRed) {
        element.setAttribute('class', 'darkerRedShape');
      } else {
        element.setAttribute('class', 'eraserIndicatorShape');
      }
    }
  }

  createMouseSquare(): void {
    this.isMouseSquare = true;
    this.mouseSquare = this.renderer.createElement('rect', 'svg');
    this.mouseSquare.setAttribute('pointer-events', 'none');
    this.mouseSquare.setAttribute('fill', 'white');
    this.mouseSquare.setAttribute('stroke', 'black');
    this.mouseSquare.setAttribute('stroke-width', '1px');
    this.mouseSquare.setAttribute('class', 'zIndex');
    this.renderer.appendChild(this.elementSVG, this.mouseSquare);
  }

  updateMouseSquare(event: MouseEvent): void {
    let eraserWidth = parseInt(this.width.width, 10);
    if (eraserWidth <= CST.PIXEL_3) {
      eraserWidth = CST.PIXEL_3;
    }
    this.mouseSquare.setAttribute('x', (event.offsetX - (eraserWidth) / 2).toString());
    this.mouseSquare.setAttribute('y', (event.offsetY - (eraserWidth) / 2).toString());
    this.mouseSquare.setAttribute('height', eraserWidth.toString());
    this.mouseSquare.setAttribute('width', eraserWidth.toString());
  }

  setCursor(): void {
    if (this.tool.tool === CST.ERASER_KEY) {
      this.elementSVG.setAttribute('class', 'noCursor');
    } else {
      this.isMouseSquare = false;
      if (this.mouseSquare !== undefined) {
        this.mouseSquare.remove();
      }
      this.elementSVG.setAttribute('class', 'wsSVGClass');
    }
  }

}
