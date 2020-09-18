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
export class EllipseService {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  ellipseContainer: HTMLElement;
  ellipseLength: number;
  posX: number;
  posY: number;
  posX0: number;
  posY0: number;
  balance: number;
  drawingInProgress: boolean;
  activateCircle: boolean;
  radiusX: number;
  radiusY: number;

  constructor(
    public sketch: SketchService,
    public pointStorage: PointStorageService,
    public commandManager: CommandManagerService,
    public color: ColorService,
    public attribute: AttributeService,
    protected rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.ellipseLength = 0;
    this.activateCircle = false;
  }

  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    if (event.key === CST.SHIFT_KEY && (isMouseUp === this.activateCircle)) {
      this.activateCircle = !this.activateCircle;
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

    const newElementEllipse = this.renderer.createElement('ellipse', 'svg');
    const newElementG = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(newElementG, newElementEllipse);
    this.renderer.appendChild(this.elementSVG, newElementG);
    this.pointStorage.addToStorage(new Point2d(event.offsetX, event.offsetY));
    this.pointStorage.addToStorage(new Point2d(event.offsetX, event.offsetY));
    newElementEllipse.setAttribute('rx', '1');
    newElementEllipse.setAttribute('ry', '1');
    newElementEllipse.setAttribute('cx', this.posX.toString());
    newElementEllipse.setAttribute('cy', this.posY.toString());
    newElementEllipse.setAttribute('stroke-width', this.attribute.width);
    newElementEllipse.setAttribute('stroke', this.color.getSecond());
    newElementEllipse.setAttribute('fill', this.color.getPrime());
    newElementEllipse.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementEllipse.setAttribute('angle', '0');
    newElementEllipse.setAttribute('vectorTranslate', '0:0');
    newElementEllipse.setAttribute('vectorScale', '1:1');
    // this.renderer.appendChild(this.elementSVG, newElementEllipse);
    this.ellipseContainer = newElementEllipse;
    this.ellipseLength++;

    const command = new CommandDrawingService(this.sketch, newElementG, this.elementSVG);

    this.commandManager.add(command);
  }

  end(): void {
    if (!this.drawingInProgress) { return; }

    this.drawingInProgress = false;
    this.pointStorage.clearStorage();
    this.sketch.add(this.ellipseContainer);

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

    this.radiusX = (this.posX - this.posX0) / 2;
    this.radiusY = (this.posY - this.posY0) / 2;

    if (this.radiusX === 0) {
      this.radiusX = 1;
    }

    if (this.radiusY === 0) {
      this.radiusY = 1;
    }

    // let temp: number;
    const zone = this.getZone(this.radiusX, this.radiusY);

    if (zone === CST.ZONE_1) {
      this.balance = CST.POSITIVE;
    }

    if (zone === CST.ZONE_2) {
      this.balance = CST.NEGATIVE;
    }
    if (zone === CST.ZONE_3) {
      this.balance = CST.POSITIVE;
    }

    if (zone === CST.ZONE_4) {
      this.balance = CST.NEGATIVE;
    }

  }

  updatePosition(): void {

    this.pointStorage.deleteLastPosition();
    this.pointStorage.addToStorage(new Point2d(this.posX, this.posY));

    this.ellipseContainer.setAttribute('rx', (Math.abs(this.radiusX)).toString());

    this.ellipseContainer.setAttribute('cx', ((this.posX0 + this.posX) / 2).toString());

    if (!this.activateCircle) {
      this.ellipseContainer.setAttribute('cy', ((this.posY0 + this.posY) / 2).toString());
      this.ellipseContainer.setAttribute('ry', (Math.abs(this.radiusY)).toString());
    } else {
      this.ellipseContainer.setAttribute('cy', ((this.posY0 + (this.radiusX * this.balance))).toString());
      this.ellipseContainer.setAttribute('ry', (Math.abs(this.radiusX)).toString());
    }
  }

  getZone(x: number, y: number): number {
    if (x > 0 && y > 0) {
      return CST.ZONE_1;
    } else if (x > 0 && y < 0) {
      return CST.ZONE_2;
    } else if (x < 0 && y < 0) {
      return CST.ZONE_3;
    } else if (x < 0 && y > 0) {
      return CST.ZONE_4;
    } else {
      return 0;
    }
  }

  searchExtremum(): void {
    const cx = parseInt(this.ellipseContainer.getAttribute('cx') as string, 10);
    const rx = parseInt(this.ellipseContainer.getAttribute('rx') as string, 10);
    const cy = parseInt(this.ellipseContainer.getAttribute('cy') as string, 10);
    const ry = parseInt(this.ellipseContainer.getAttribute('ry') as string, 10);
    const minimum: Point2d = new Point2d((cx - rx), (cy - ry));
    const maximum: Point2d = new Point2d((cx + rx), (cy + ry));
    const centerElement: Point2d = new Point2d((minimum.x + maximum.x) / 2, (minimum.y + maximum.y) / 2);
    this.ellipseContainer.setAttribute('maximum', `${maximum.x}:${maximum.y}`);
    this.ellipseContainer.setAttribute('minimum', `${minimum.x}:${minimum.y}`);
    this.ellipseContainer.setAttribute('centerElement', `${centerElement.x}:${centerElement.y}`);
  }

}
