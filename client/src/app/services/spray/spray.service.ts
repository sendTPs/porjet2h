import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { Point2d } from '@app/models/point2d.class';
import * as CST from '@models/constants';

import { AttributeService } from '@services/attribute/attribute.service';
import { ColorService } from '@services/color/color.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandDrawingService } from '@services/command/commands/drawing-command.service';
import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SketchService } from '@services/sketch/sketch.service';

@Injectable({ providedIn: 'root' })
export class SprayService {

  renderer: Renderer2;
  sprayContainer: HTMLElement;
  numberOfSpray: number;
  newElementSpray: SVGPathElement;
  elementSVG: HTMLElement;
  drawingInProcess: boolean;
  currentPosition: Point2d;
  interval: number;
  eleGroup: HTMLElement;
  currentWidth: number;
  emissionsPerSecond: number;
  width: number;

  constructor(
    public pointStorage: PointStorageService,
    private color: ColorService,
    public commandManager: CommandManagerService,
    protected renderFactory: RendererFactory2,
    public sketch: SketchService,
    public attribute: AttributeService,
  ) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.numberOfSpray = CST.NOT_IN_THE_ARRAY;
    this.drawingInProcess = false;
    this.emissionsPerSecond = CST.MINIMUM_EMISSIONS * 2;
  }

  shortcut(): void { return; }

  start(event: MouseEvent): void {
    this.sprayContainer = this.renderer.createElement('path', 'svg');
    this.eleGroup = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(this.eleGroup, this.sprayContainer);
    this.currentWidth = parseInt(this.attribute.width, 10);
    this.renderer.appendChild(this.elementSVG, this.eleGroup);
    this.sprayContainer.setAttribute('stroke', this.color.getPrime());
    this.sprayContainer.setAttribute('stroke-width', '3');
    this.sprayContainer.setAttribute('fill', 'none');
    this.sprayContainer.setAttribute('d', `M${event.offsetX},${event.offsetY}`);
    this.sprayContainer.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    this.sprayContainer.setAttribute('stroke-linecap', 'round');
    this.sprayContainer.setAttribute('stroke-linejoin', 'round');
    this.sprayContainer.setAttribute('angle', '0');
    this.sprayContainer.setAttribute('vectorTranslate', '0:0');
    this.sprayContainer.setAttribute('vectorScale', '1:1');
    this.drawingInProcess = true;
    this.interval =
      setInterval(this.createPoint as TimerHandler, CST.MAX_EMISSIONS - this.emissionsPerSecond, event, this, this.currentWidth);

    const command = new CommandDrawingService(this.sketch, this.eleGroup, this.elementSVG);

    this.commandManager.add(command);
    return;
  }

  end(): void {
    if (!this.drawingInProcess) {
      return;
    }
    this.sketch.add(this.sprayContainer);
    this.drawingInProcess = false;
    this.searchExtremum();
    this.pointStorage.clearStorage();
    clearInterval(this.interval);
  }

  createPoint(event: MouseEvent, currentService: SprayService, w: number): void {

    const nbPoints = currentService.emissionsPerSecond / (CST.MINIMUM_EMISSIONS * 2);

    for (let i = 0; i < nbPoints; i++) {
      // const newElementPoint = currentService.renderer.createElement('polyline', 'svg');
      currentService.currentPosition = new Point2d(event.offsetX, event.offsetY);
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * w;
      const x = Math.floor(radius * Math.cos(angle) + currentService.currentPosition.x);
      const y = Math.floor(radius * Math.sin(angle) + currentService.currentPosition.y);
      currentService.pointStorage.addToStorage(new Point2d(x, y));
      const attr = currentService.sprayContainer.getAttribute('d') as string;
      currentService.sprayContainer.setAttribute('d', `${attr} M${x},${y} L${x},${y}`);
    }
  }

  draw(event: MouseEvent): void {
    if (!this.drawingInProcess) {
      return;
    }
    clearInterval(this.interval);
    this.currentPosition = new Point2d(event.offsetX, event.offsetY);
    this.interval = setInterval(this.createPoint as TimerHandler, 1, event, this, this.currentWidth);

  }

  searchExtremum(): void {
    const pData = this.pointStorage.getStorage();
    let maximum: { x: number, y: number };
    maximum = { x: -1, y: -1 };
    let minimum: { x: number, y: number };
    minimum = { x: Infinity, y: Infinity };
    pData.forEach((element) => {
      if (element.x < minimum.x) { minimum.x = element.x; }
      if (element.y < minimum.y) { minimum.y = element.y; }
      if (maximum.x < element.x) { maximum.x = element.x; }
      if (maximum.y < element.y) { maximum.y = element.y; }
    });
    this.sprayContainer.setAttribute('maximum', '0:0');
    this.sprayContainer.setAttribute('minimum', '0:0');
    this.sprayContainer.setAttribute('centerElement', '0:0');
  }

}
