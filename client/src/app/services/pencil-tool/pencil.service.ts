import { Injectable, Renderer2, RendererFactory2, } from '@angular/core';

import { Point2d } from '@models/point2d.class';
import { ToolInterface } from '@models/tool.interface';

import { AttributeService } from '@services/attribute/attribute.service';
import { ColorService } from '@services/color/color.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandDrawingService } from '@services/command/commands/drawing-command.service';
import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SketchService } from '@services/sketch/sketch.service';
import { TypeToolService } from '@services/type-tool/type-tool.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService implements ToolInterface {

  renderer: Renderer2;
  pencilContainer: HTMLElement;
  pencilLength: number;
  elementSVG: HTMLElement;
  drawingInProcess: boolean;

  constructor(
    public sketch: SketchService,
    public typeBrush: TypeToolService,
    public pointStorage: PointStorageService,
    public commandManager: CommandManagerService,
    private width: AttributeService,
    private color: ColorService,
    protected renderFactory: RendererFactory2
  ) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.pencilLength = 0;
    this.drawingInProcess = false;
  }

  shortcut(): void { return; }

  start(event: MouseEvent): void {
    this.drawingInProcess = true;
    this.searchPosition(event);
    const newElementPencil = this.renderer.createElement('polyline', 'svg');
    const newElementG = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(newElementG, newElementPencil);
    this.renderer.appendChild(this.elementSVG, newElementG);
    // newElementPencil.setAttribute('class', 'toolMark');
    newElementPencil.setAttribute('stroke', this.color.getPrime());
    newElementPencil.setAttribute('stroke-linecap', 'round');
    newElementPencil.setAttribute('stroke-linejoin', 'round');
    newElementPencil.setAttribute('fill', 'none');

    newElementPencil.setAttribute('points', this.addDataToPath() + ' ' + this.addDataToPath());
    if (this.typeBrush.activatedTypeBrush !== 'normal') {
      newElementPencil.setAttribute('filter', `url(#${this.typeBrush.activatedTypeBrush})`);
    }
    // newElementPencil.setAttribute('transform', 'translate(0 0)');
    newElementPencil.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementPencil.setAttribute('angle', '0');
    newElementPencil.setAttribute('vectorTranslate', '0:0');
    newElementPencil.setAttribute('vectorScale', '1:1');
    newElementPencil.setAttribute('id', 'pathNo' + this.pencilLength);
    newElementPencil.setAttribute('stroke-width', parseInt(this.width.width, 10).toString());

    this.pencilLength++;
    this.pencilContainer = newElementPencil;

    const command = new CommandDrawingService(this.sketch, newElementG, this.elementSVG);
    this.commandManager.add(command);
  }

  end(): void {
    if (!this.drawingInProcess) { return; }
    this.sketch.add(this.pencilContainer);
    this.drawingInProcess = false;
    this.searchExtremum();
    this.pointStorage.clearStorage();
  }

  draw(event: MouseEvent): void {
    if (this.drawingInProcess) {
      this.searchPosition(event);
      this.updateCurrentPath();
    }
  }

  updateCurrentPath(): void {
    const attributeD = this.pencilContainer.getAttribute('points') + ' ' + this.addDataToPath();
    this.pencilContainer.setAttribute('points', attributeD);
  }

  searchPosition(event: MouseEvent): void {
    const positionX = event.offsetX;
    const positionY = event.offsetY;
    this.pointStorage.addToStorage(new Point2d(positionX, positionY));
  }

  addDataToPath(): string {
    const pointData = this.pointStorage.getStorage();
    return pointData[pointData.length - 1].x + ',' + pointData[pointData.length - 1].y;
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
    this.pencilContainer.setAttribute('maximum', `${maximum.x}:${maximum.y}`);
    this.pencilContainer.setAttribute('minimum', `${minimum.x}:${minimum.y}`);
    this.pencilContainer.setAttribute('centerElement', `${centerElement.x}:${centerElement.y}`);
  }
}
