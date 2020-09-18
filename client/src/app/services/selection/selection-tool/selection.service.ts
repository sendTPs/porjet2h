import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@models/constants';
import { Data } from '@models/data-elements.class';
import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SelectionLogicService } from '@services/selection/selection-logic/selection-logic.service';
import { SelectionMoveService } from '@services/selection/selection-move/selection-move.service';
import { SelectionResizeService } from '@services/selection/selection-resize/selection-resize.service';
import { SelectionRotateService } from '@services/selection/selection-rotate/selection-rotate.service';
import { SketchService } from '@services/sketch/sketch.service';
import { ToolService } from '@services/tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  elementActionG: HTMLElement;
  drawingInProcess: boolean;
  selectionBoxCreated: boolean;
  width: number;
  height: number;
  selectionContainer: HTMLElement;

  constructor(
    public logic: SelectionLogicService,
    public rotate: SelectionRotateService,
    public resize: SelectionResizeService,
    public pointStorage: PointStorageService,
    public sketch: SketchService,
    public move: SelectionMoveService,
    private tool: ToolService,
    protected rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    event.preventDefault();
    const myEvent = { key: event.key, ctrlKey: event.ctrlKey, altKey: event.altKey, shiftKey: event.shiftKey } as KeyboardEvent;
    if (this.logic.isEquivalent(myEvent, CST.ALL_SHORTCUT_EVENT) && !isMouseUp) {
      this.logic.initSelect = new Point2d(-Infinity, -Infinity);
      this.logic.finalSelect = new Point2d(Infinity, Infinity);
      this.drawingInProcess = true;
      this.selectionBoxCreated = true;
      this.logic.eventMemory = { buttons: 1 } as MouseEvent;
      this.end();
    }
    if (this.logic.isEquivalent(myEvent, CST.RIGHT_SHORTCUT_EVENT) && !isMouseUp) {
      if (this.elementActionG !== undefined) {
        this.move.isMoving = true;
        this.move.mouseMove(CST.MOVE_RIGHT_EVENT, true);
        this.move.isMoving = false;
      }
    }
    if (this.logic.isEquivalent(myEvent, CST.LEFT_SHORTCUT_EVENT) && !isMouseUp) {
      if (this.elementActionG !== undefined) {
        this.move.isMoving = true;
        this.move.mouseMove(CST.MOVE_LEFT_EVENT, true);
        this.move.isMoving = false;
      }
    }
    if (this.logic.isEquivalent(myEvent, CST.UP_SHORTCUT_EVENT) && !isMouseUp) {
      if (this.elementActionG !== undefined) {
        this.move.isMoving = true;
        this.move.mouseMove(CST.MOVE_UP_EVENT, true);
        this.move.isMoving = false;
      }
    }
    if (this.logic.isEquivalent(myEvent, CST.DOWN_SHORTCUT_EVENT) && !isMouseUp) {
      if (this.elementActionG !== undefined) {
        this.move.isMoving = true;
        this.move.mouseMove(CST.MOVE_DOWN_EVENT, true);
        this.move.isMoving = false;
      }
    }
    this.rotate.shortcutALT(myEvent, isMouseUp);
    this.rotate.shortcutSHIFT(myEvent, isMouseUp);
  }

  start(event: MouseEvent): void {
    if (this.drawingInProcess) {
      this.draw(event);
    }
    this.move.elementSVG = this.elementSVG;
    this.drawingInProcess = true;
    this.selectionBoxCreated = false;
    this.logic.eventMemory = event;
    this.logic.elementTargeted = event.target as HTMLElement;
    this.logic.initSelect = new Point2d(event.offsetX, event.offsetY);
    this.logic.finalSelect = new Point2d(event.offsetX, event.offsetY);
    const newElementRect = this.renderer.createElement('rect', 'svg');
    this.pointStorage.addToStorage(this.logic.initSelect);
    this.pointStorage.addToStorage(this.logic.initSelect);
    newElementRect.setAttribute('id', 'id0');
    newElementRect.setAttribute('height', '1');
    newElementRect.setAttribute('width', '1');
    newElementRect.setAttribute('x', this.logic.initSelect.x.toString());
    newElementRect.setAttribute('y', this.logic.initSelect.y.toString());
    newElementRect.setAttribute('stroke-width', '1');
    newElementRect.setAttribute('stroke', 'grey');
    newElementRect.setAttribute('stroke-dasharray', '10,6');
    newElementRect.setAttribute('fill', 'none');
    // this.renderer.appendChild(newElementSVG, newElementSVG);
    this.renderer.appendChild(this.elementSVG, newElementRect);
    this.selectionContainer = newElementRect;
  }

  draw(event: MouseEvent): void {
    if (!this.drawingInProcess) { return; }
    this.selectionBoxCreated = true;
    this.searchPosition(event);
    this.updatePosition();
  }

  end(): void {
    if (!this.drawingInProcess) { return; }
    this.drawingInProcess = false;
    this.pointStorage.clearStorage();
    if (this.elementActionG !== undefined) {
      this.elementActionG.remove();
    }
    if (this.selectionBoxCreated) {
      if (this.logic.selectedByRectangle()) {
        this.createRectangleAction();
      }
    } else {
      if (this.logic.selectedByClick()) {
        this.createRectangleAction();
      }
    }
    if (this.selectionContainer !== undefined) {
      this.selectionContainer.remove();
    }

    this.logic.eventMemory = {} as MouseEvent;
    this.logic.initSelect = new Point2d(0, 0);
    this.logic.finalSelect = new Point2d(0, 0);
    this.pointStorage.clearStorage();
  }

  searchPosition(event: MouseEvent): void {
    this.logic.finalSelect = new Point2d(event.offsetX, event.offsetY);
    this.logic.initSelect = new Point2d(this.pointStorage.getStorage()[CST.FIRST].x, this.pointStorage.getStorage()[CST.FIRST].y);

    this.width = this.logic.finalSelect.x - this.logic.initSelect.x;
    this.height = this.logic.finalSelect.y - this.logic.initSelect.y;

    let temp: number;
    const zone = this.logic.getZone(this.width, this.height);

    if (zone === CST.ZONE_1) {
      this.pointStorage.deleteLastPosition();
      this.pointStorage.addToStorage(this.logic.finalSelect);
    }

    if (zone === CST.ZONE_2) {
      temp = this.logic.initSelect.y;
      this.logic.initSelect.y = this.logic.finalSelect.y;
      this.logic.finalSelect.y = temp;
      this.pointStorage.deleteLastPosition();
      this.pointStorage.addToStorage(this.logic.finalSelect);
    }

    if (zone === CST.ZONE_3) {
      temp = this.logic.initSelect.x;
      this.logic.initSelect.x = this.logic.finalSelect.x;
      this.logic.finalSelect.x = temp;
      temp = this.logic.initSelect.y;
      this.logic.initSelect.y = this.logic.finalSelect.y;
      this.logic.finalSelect.y = temp;
      this.pointStorage.deleteLastPosition();
      this.pointStorage.addToStorage(this.logic.finalSelect);
    }

    if (zone === CST.ZONE_4) {
      temp = this.logic.initSelect.x;
      this.logic.initSelect.x = this.logic.finalSelect.x;
      this.logic.finalSelect.x = temp;
      this.pointStorage.deleteLastPosition();
      this.pointStorage.addToStorage(this.logic.finalSelect);
    }

  }

  updatePosition(): void {
    this.width = this.logic.finalSelect.x - this.logic.initSelect.x;
    this.height = this.logic.finalSelect.y - this.logic.initSelect.y;
    this.selectionContainer.setAttribute('height', `${Math.abs(this.height)}`);
    this.selectionContainer.setAttribute('width', `${Math.abs(this.width)}`);
    this.selectionContainer.setAttribute('x', `${this.logic.initSelect.x}`);
    this.selectionContainer.setAttribute('y', `${this.logic.initSelect.y}`);
  }

  erase(): void {
    if (this.elementActionG !== undefined && this.tool.tool !== CST.SELECTION_KEY) {
      console.log('removing');
      this.elementActionG.remove();
      this.logic.clearSelectedElement();
    }
  }

  createRectangleAction(): void {
    this.elementActionG = this.renderer.createElement('g', 'svg');
    this.elementActionG.setAttribute('class', 'selectorBox');
    this.elementActionG.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    // this.elementActionG.setAttribute('centerElement', `${this.logic.center.x}:${this.logic.center.y}`);
    this.elementActionG.setAttribute('angle', '0');
    this.elementActionG.setAttribute('vectorTranslate', '0:0');

    const newElementRect: HTMLElement = this.renderer.createElement('rect', 'svg');
    newElementRect.setAttribute('stroke-width', '2');
    newElementRect.setAttribute('stroke', 'grey');
    newElementRect.setAttribute('fill', 'rgba(0,0,0,0)');
    // newElementRect.setAttribute('fill', 'none');
    newElementRect.setAttribute('x', `${this.logic.init.x}`);
    newElementRect.setAttribute('y', `${this.logic.init.y}`);
    newElementRect.setAttribute('width', `${this.logic.final.x - this.logic.init.x}`);
    newElementRect.setAttribute('height', `${this.logic.final.y - this.logic.init.y}`);
    newElementRect.addEventListener('wheel', ($event) => this.rotate.wheelUse($event));
    this.renderer.appendChild(this.elementActionG, newElementRect);

    const dataCenter = new Data(this.logic.init.x, this.logic.final.x, 2, this.logic.init.y, this.logic.final.y, 2, 'center', 'move');
    this.createElement(dataCenter);

    const dataLeft = new Data(this.logic.init.x, 0, 1, this.logic.init.y, this.logic.final.y, 2, 'left', 'e-resize');
    this.createElement(dataLeft);

    const dataRight = new Data(0, this.logic.final.x, 1, this.logic.init.y, this.logic.final.y, 2, 'right', 'e-resize');
    this.createElement(dataRight);

    const dataUp = new Data(this.logic.init.x, this.logic.final.x, 2, this.logic.init.y, 0, 1, 'up', 'n-resize');
    this.createElement(dataUp);

    const dataDown = new Data(this.logic.init.x, this.logic.final.x, 2, 0, this.logic.final.y, 1, 'down', 'n-resize');
    this.createElement(dataDown);

    this.renderer.appendChild(this.elementSVG, this.elementActionG);
    this.logic.elementSelected.push(this.elementActionG);
    this.logic.elementActionG = this.elementActionG;
  }

  createElement(d: Data): boolean {
    const element: HTMLElement = this.renderer.createElement('circle', 'svg');
    element.setAttribute('stroke-width', '1');
    element.setAttribute('stroke', 'grey');
    element.setAttribute('fill', 'blue');
    element.setAttribute('r', '4');
    element.setAttribute('cx', `${(d.xi + d.xf) / d.dx}`);
    element.setAttribute('cy', `${(d.yi + d.yf) / d.dy}`);
    element.setAttribute('style', `cursor: ${d.cursor}`);
    this.renderer.appendChild(this.elementActionG, element);
    element.setAttribute('id', d.fct);

    if (d.fct === 'center') {
      element.setAttribute('r', '8');
      element.addEventListener('mousedown', ($event) => this.move.mouseDown($event));
      element.addEventListener('mouseenter', () => { this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT); });
      element.addEventListener('mouseleave', () => { this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT); });
      element.addEventListener('wheel', ($event) => this.rotate.wheelUse($event));
      // this.logic.centerActionG = element;
      return true;
    }
    if (d.fct === 'down') {
      element.addEventListener('mousedown', () => { this.resize.resizableDown(); });
      element.addEventListener('mouseenter', () => { this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT); });
      element.addEventListener('mouseleave', () => { this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT); });
      return true;
    }
    if (d.fct === 'left') {
      element.addEventListener('mousedown', () => { this.resize.resizableLeft(); });
      element.addEventListener('mouseenter', () => { this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT); });
      element.addEventListener('mouseleave', () => { this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT); });
      return true;
    }
    if (d.fct === 'right') {
      element.addEventListener('mousedown', () => { this.resize.resizableRight(); });
      element.addEventListener('mouseenter', () => { this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT); });
      element.addEventListener('mouseleave', () => { this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT); });
      return true;
    }
    if (d.fct === 'up') {
      element.addEventListener('mousedown', () => { this.resize.resizableUp(); });
      element.addEventListener('mouseenter', () => { this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT); });
      element.addEventListener('mouseleave', () => { this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT); });
      return true;
    }
    return false;
  }
}
