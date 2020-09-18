import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { AttributeService } from '@services/attribute/attribute.service';
import { ColorService } from '@services/color/color.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandDrawingService } from '@services/command/commands/drawing-command.service';
import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SketchService } from '@services/sketch/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  polygonContainer: HTMLElement;
  polygonLength: number;
  border: number;
  posX: number;
  posY: number;
  posX0: number;
  posY0: number;
  balance: number;
  drawingInProgress: boolean;
  height: number;
  width: number;
  radius: number;
  position: number[];

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
    this.polygonLength = 0;
  }

  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    // Do nothing
  }

  start(event: MouseEvent): void {
    if (this.drawingInProgress) {
      this.draw(event);
    }
    this.border = parseInt(this.widthStroke.border, 10);
    this.drawingInProgress = true;
    this.posX0 = event.offsetX;
    this.posY0 = event.offsetY;
    const newElementPolygon = this.renderer.createElement('polygon', 'svg');
    const newElementG = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(newElementG, newElementPolygon);
    this.renderer.appendChild(this.elementSVG, newElementG);
    newElementPolygon.setAttribute('points', '0,0 0,0');
    newElementPolygon.setAttribute('stroke-width', this.widthStroke.width);
    newElementPolygon.setAttribute('stroke', this.color.getSecond());
    newElementPolygon.setAttribute('fill', this.color.getPrime());
    newElementPolygon.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementPolygon.setAttribute('angle', '0');
    newElementPolygon.setAttribute('vectorTranslate', '0:0');
    newElementPolygon.setAttribute('vectorScale', '1:1');
    this.polygonContainer = newElementPolygon;

    const command = new CommandDrawingService(this.sketch, newElementG, this.elementSVG);
    this.commandManager.add(command);

    this.polygonLength++;
  }

  end(): void {
    if (!this.drawingInProgress) { return; }

    this.searchExtremum();
    this.drawingInProgress = false;
    this.pointStorage.clearStorage();
    this.sketch.add(this.polygonContainer);
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

    this.width = this.posX - this.posX0;
    this.height = this.posY - this.posY0;

    const zone = this.getZone(this.width, this.height);

    if (zone === CST.ZONE_1) {
      this.posY = this.posY0 + this.width;
    }
    if (zone === CST.ZONE_2) {
      this.posY = this.posY0 - this.width;
    }
    if (zone === CST.ZONE_3) {
      this.posY = this.posY0 + this.width;
    }
    if (zone === CST.ZONE_4) {
      this.posY = this.posY0 - this.width;
    }

  }

  updatePosition(): void {

    const centerX = (this.posX + this.posX0) / 2;
    const centerY = (this.posY + this.posY0) / 2;

    this.pointStorage.clearStorage();

    this.radius = this.width / 2;
    let attribute = '';

    for (let i = 0; i < this.border; i++) {
      if (i !== 0) { attribute += ' '; }
      const px = centerX + Math.floor(Math.cos((2 * Math.PI / this.border) * i - (Math.PI / 2)) * this.radius);
      const py = centerY + Math.floor(Math.sin((2 * Math.PI / this.border) * i - (Math.PI / 2)) * this.radius);
      this.pointStorage.addToStorage(new Point2d(px, py));
      attribute += `${px},${py}`;
    }
    this.polygonContainer.setAttribute('points', attribute);
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
    this.polygonContainer.setAttribute('maximum', `${maximum.x}:${maximum.y}`);
    this.polygonContainer.setAttribute('minimum', `${minimum.x}:${minimum.y}`);
    this.polygonContainer.setAttribute('centerElement', `${centerElement.x}:${centerElement.y}`);
  }
}
