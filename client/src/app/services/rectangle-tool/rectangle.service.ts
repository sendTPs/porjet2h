import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';
import { ToolInterface } from '@models/tool.interface';

import { AttributeService } from '@services/attribute/attribute.service';
import { ColorService } from '@services/color/color.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandDrawingService } from '@services/command/commands/drawing-command.service';
import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SketchService } from '@services/sketch/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements ToolInterface {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  rectangleContainer: HTMLElement;
  rectLength: number;
  posX: number;
  posY: number;
  posX0: number;
  posY0: number;
  balance: number;
  drawingInProgress: boolean;
  activateSquare: boolean;
  height: number;
  width: number;

  constructor(
    public sketch: SketchService,
    public pointStorage: PointStorageService,
    public commandManager: CommandManagerService,
    public color: ColorService,
    public widthStroke: AttributeService,
    protected rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.drawingInProgress = false;
    this.activateSquare = false;
    this.rectLength = 0;
  }

  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    if (event.key === CST.SHIFT_KEY && (isMouseUp === this.activateSquare)) {
      this.activateSquare = !this.activateSquare;
      if (this.drawingInProgress) {
        this.updatePosition();
      }
    }
  }

  start(event: MouseEvent): void {
    if (this.drawingInProgress) {
      this.draw(event);
    }

    this.drawingInProgress = true;
    this.posX = event.offsetX;
    this.posY = event.offsetY;
    this.posX0 = event.offsetX;
    this.posY0 = event.offsetY;
    const newElementRect = this.renderer.createElement('rect', 'svg');
    const newElementG = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(newElementG, newElementRect);
    this.renderer.appendChild(this.elementSVG, newElementG);
    this.pointStorage.addToStorage(new Point2d(event.offsetX, event.offsetY));
    this.pointStorage.addToStorage(new Point2d(event.offsetX, event.offsetY));
    newElementRect.setAttribute('height', '1');
    newElementRect.setAttribute('width', '1');
    newElementRect.setAttribute('x', this.posX.toString());
    newElementRect.setAttribute('y', this.posY.toString());
    newElementRect.setAttribute('stroke-width', this.widthStroke.width);
    newElementRect.setAttribute('stroke', this.color.getSecond());
    newElementRect.setAttribute('fill', this.color.getPrime());
    newElementRect.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementRect.setAttribute('angle', '0');
    newElementRect.setAttribute('vectorTranslate', '0:0');
    newElementRect.setAttribute('vectorScale', '1:1');
    // this.renderer.appendChild(this.elementSVG, newElementRect);
    this.rectangleContainer = newElementRect;
    this.rectLength++;

    const command = new CommandDrawingService(this.sketch, newElementRect, this.elementSVG);
    this.commandManager.add(command);
  }

  end(): void {
    if (!this.drawingInProgress) { return; }

    this.searchExtremum();
    this.drawingInProgress = false;
    this.pointStorage.clearStorage();
    this.sketch.add(this.rectangleContainer);

    this.posX = 0;
    this.posY = 0;
    this.posX0 = 0;
    this.posY0 = 0;
  }

  draw(event: MouseEvent): void {
    if (!this.drawingInProgress) {
      return;
    }
    this.searchPosition(event);
    this.updatePosition();
  }

  searchPosition(event: MouseEvent): void {
    this.posX = event.offsetX;
    this.posY = event.offsetY;

    this.posX0 = this.pointStorage.getStorage()[0].x;
    this.posY0 = this.pointStorage.getStorage()[0].y;

    this.width = this.posX - this.posX0;
    this.height = this.posY - this.posY0;

    if (this.height === 0) {
      this.height = 1;
    }
    if (this.width === 0) {
      this.width = 1;
    }

    let temp: number;
    const zone = this.getZone(this.width, this.height);

    if (zone === CST.ZONE_1) {
      this.balance = 0;
    }

    if (zone === CST.ZONE_2) {
      this.balance = Math.abs(this.height) - Math.abs(this.width);
      temp = this.posY0;
      this.posY0 = this.posY;
      this.posY = temp;
    }

    if (zone === CST.ZONE_3) {
      this.balance = this.width - this.height;
      temp = this.posX0;
      this.posX0 = this.posX;
      this.posX = temp;
      temp = this.posY0;
      this.posY0 = this.posY;
      this.posY = temp;
    }

    if (zone === CST.ZONE_4) {
      this.balance = 0;
      temp = this.posX0;
      this.posX0 = this.posX;
      this.posX = temp;
    }

  }

  updatePosition(): void {

    this.width = this.posX - this.posX0;
    this.height = this.posY - this.posY0;
    if (this.activateSquare) {
      this.height = this.width;
    } else {
      this.balance = 0;
    }
    this.pointStorage.deleteLastPosition();
    this.pointStorage.addToStorage(new Point2d(this.posX, this.posY));
    this.rectangleContainer.setAttribute('height', (Math.abs(this.height)).toString());
    this.rectangleContainer.setAttribute('width', (Math.abs(this.width)).toString());
    this.rectangleContainer.setAttribute('x', (this.posX0).toString());
    this.rectangleContainer.setAttribute('y', (this.posY0 + this.balance).toString());
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

  searchExtremum(): void {
    const pData = this.pointStorage.getStorage();
    // tslint:disable-next-line: prefer-const
    let minimum: Point2d = new Point2d(Infinity, Infinity);
    // tslint:disable-next-line: prefer-const
    let maximum: Point2d = new Point2d();
    pData.forEach((element) => {
      if (element.x < minimum.x) { minimum.x = element.x; }
      if (element.y < minimum.y) { minimum.y = element.y; }
      if (maximum.x < element.x) { maximum.x = element.x; }
      if (maximum.y < element.y) { maximum.y = element.y; }
    });
    const centerElement = { x: (minimum.x + maximum.x) / 2, y: (minimum.y + maximum.y) / 2 };
    this.rectangleContainer.setAttribute('maximum', `${maximum.x}:${maximum.y}`);
    this.rectangleContainer.setAttribute('minimum', `${minimum.x}:${minimum.y}`);
    this.rectangleContainer.setAttribute('centerElement', `${centerElement.x}:${centerElement.y}`);
  }

}
