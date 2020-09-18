import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { Point2d } from '@app/models/point2d.class';
import * as CST from '@models/constants';
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

export class LineService implements ToolInterface {

  renderer: Renderer2;
  lineContainer: HTMLElement;
  jonctionContainer: HTMLElement[];
  linesLength: number;
  attributeD: string;
  elementSVG: HTMLElement;
  elementG: HTMLElement;

  /**** FONCTIONNALITÉS ****/
  drawingInProcess: boolean;
  forceAngleSituation: Map<string, string>;
  forceAngleActivated: boolean;

  constructor(
    public sketch: SketchService,
    public pointStorage: PointStorageService,
    public attribute: AttributeService,
    public color: ColorService,
    public commandManager: CommandManagerService,
    protected rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.jonctionContainer = new Array<HTMLElement>();
    this.linesLength = 0;
    this.attributeD = '';
    this.drawingInProcess = false;
    this.forceAngleSituation = new Map<string, string>();
    this.forceAngleActivated = false;

    this.forceAngleSituation.set('1111', '1')  // 1
      .set('1110', '2')  // 2
      .set('1101', '2')  // 3  --> 5
      .set('1100', '3')  // 4
      .set('1011', '4')  // 15
      .set('1010', '1')  // 16
      .set('1001', '4')  // 14 --> 6
      .set('1000', '3')  // 13
      .set('0111', '1')  // 8
      .set('0110', '4')  // 7
      .set('0101', '3')  // 5
      .set('0100', '4')  // 6  --> 6
      .set('0011', '2')  // 10
      .set('0010', '1')  // 9
      .set('0001', '3')  // 12
      .set('0000', '2'); // 11 --> 5
  }

  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    // this.fonctionnality.get(noKey);
    if (event.key === CST.SHIFT_KEY && (isMouseUp === this.forceAngleActivated)) {
      this.forceAngleActivated = !this.forceAngleActivated;
      if (this.drawingInProcess) {
        this.updateCurrentPath();
      }
    }
    if (event.key === CST.ESCAPE_KEY && !isMouseUp) {
      this.deleteCurrentLine(this.elementSVG);
    }
    if (event.key === CST.BACKSPACE_KEY && !isMouseUp) {
      this.deleteLastPosition();
    }
  }

  start(event: MouseEvent): void {
    if (this.drawingInProcess) {
      this.drawNewLine(event);
      return;
    }

    this.drawingInProcess = true;
    this.elementG = this.renderer.createElement('g', 'svg');
    const newElementLine = this.renderer.createElement('polyline', 'svg');
    this.renderer.appendChild(this.elementG, newElementLine);
    this.elementG.setAttribute('pointer-events', 'none');
    this.searchPosition(event, false);
    this.makePointJonction();
    this.searchPosition(event, false);
    this.attributeD = this.addDataToLine();
    newElementLine.setAttribute('points', this.attributeD + ' ' + this.addDataToLine());
    // newElementLine.setAttribute('class', 'toolMark');
    newElementLine.setAttribute('stroke-linecap', 'round');
    newElementLine.setAttribute('stroke-linejoin', 'round');
    newElementLine.setAttribute('fill', 'none');
    newElementLine.setAttribute('stroke', this.color.prime);
    newElementLine.setAttribute('id', 'lineNo' + this.linesLength);
    newElementLine.setAttribute('stroke-width', this.attribute.width);
    // newElementPencil.setAttribute('transform', 'translate(0 0)');
    newElementLine.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementLine.setAttribute('angle', '0');
    newElementLine.setAttribute('vectorTranslate', '0:0');
    newElementLine.setAttribute('vectorScale', '1:1');
    this.renderer.appendChild(this.elementSVG, this.elementG);
    this.lineContainer = newElementLine;
    this.linesLength++;
    const command = new CommandDrawingService(this.sketch, this.elementG, this.elementSVG);
    this.commandManager.add(command);
  }

  makePointJonction(): void {
    if (!this.attribute.activateJonction) { return; }
    const newElementCircle: HTMLElement = this.renderer.createElement('circle', 'svg');
    this.renderer.appendChild(this.elementG, newElementCircle);
    newElementCircle.setAttribute('r', this.attribute.widthJonction);
    newElementCircle.setAttribute('cx', this.addDataToLine().split(',')[0]);
    newElementCircle.setAttribute('cy', this.addDataToLine().split(',')[1]);
    newElementCircle.setAttribute('fill', this.color.getPrime());
    newElementCircle.setAttribute('maximum', `${this.addDataToLine().split(',')[CST.X]}:${this.addDataToLine().split(',')[CST.Y]}`);
    newElementCircle.setAttribute('minimum', `${this.addDataToLine().split(',')[CST.X]}:${this.addDataToLine().split(',')[CST.Y]}`);
    newElementCircle.setAttribute('centerElement', `${this.addDataToLine().split(',')[CST.X]}:${this.addDataToLine().split(',')[CST.Y]}`);
    newElementCircle.setAttribute('angle', '0');
    newElementCircle.setAttribute('vectorTranslate', '0:0');
    newElementCircle.setAttribute('vectorScale', '1:1');
    newElementCircle.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    this.sketch.add(newElementCircle);
    this.jonctionContainer.push(newElementCircle);
  }

  draw(event: MouseEvent): void {
    if (!this.drawingInProcess) { return; }
    this.updateCurrentPath();
    this.searchPosition(event, true);
  }

  drawNewLine(event: MouseEvent): void {
    if (!this.drawingInProcess) { return; }
    this.updateNewPath();
    this.searchPosition(event, false);
  }

  end(): void {
    if (!this.drawingInProcess) { return; }
    this.elementG.setAttribute('pointer-events', 'auto');
    this.drawingInProcess = false;
    this.setLastPoint();
    this.searchExtremum();
    this.pointStorage.clearStorage();
    this.sketch.add(this.lineContainer);
  }

  deleteCurrentLine(element: HTMLElement): void {
    if (this.drawingInProcess) {
      this.lineContainer.remove();
      this.jonctionContainer.forEach(() => element.remove());
      this.jonctionContainer.pop();
      this.lineContainer = {} as HTMLElement;
      this.linesLength--;
      this.end();
    }
  }

  deleteLastPosition(): void {
    this.attributeD = this.lineContainer.getAttribute('points') as string;
    const strSplit = this.attributeD.split(' ');
    let newAttributeD = strSplit[0];
    for (let i = 1; i < strSplit.length - 1; i++) {
      if (i < strSplit.length - 2) {
        newAttributeD += ' ' + strSplit[i];
      }
    }
    this.attributeD = newAttributeD;
    this.updateCurrentPath();
    this.deleteLastJonction();
  }

  deleteLastJonction(): void {
    if (this.attribute.activateJonction) {
      (this.jonctionContainer.pop() as ChildNode).remove();
    }
  }

  updateCurrentJonction(): void {
    if (this.attribute.activateJonction) {
      this.jonctionContainer[this.jonctionContainer.length - 1].setAttribute('cx', this.addDataToLine().split(',')[0]);
      this.jonctionContainer[this.jonctionContainer.length - 1].setAttribute('cy', this.addDataToLine().split(',')[1]);
    }
  }

  updateCurrentPath(): void {
    const str = this.attributeD + ' ' + this.addDataToLine();
    this.lineContainer.setAttribute('points', str);
  }

  updateNewPath(): void {
    this.attributeD = this.lineContainer.getAttribute('points') as string;
    this.lineContainer.setAttribute('points', this.attributeD + ' ' + this.addDataToLine());
    this.makePointJonction();
  }

  searchPosition(event: MouseEvent, deleteLastPosition: boolean): void {
    if (deleteLastPosition) { this.pointStorage.deleteLastPosition(); }
    this.pointStorage.addToStorage(new Point2d(event.offsetX, event.offsetY));
  }

  setLastPoint(): void {
    const lastX = this.pointStorage.getStorage()[this.pointStorage.getStorage().length - 1].x;
    const firstX = this.pointStorage.getStorage()[0].x;
    const lastY = this.pointStorage.getStorage()[this.pointStorage.getStorage().length - 1].y;
    const firstY = this.pointStorage.getStorage()[0].y;
    const isLessThan3pxInX = (Math.abs(lastX - firstX) <= CST.PIXEL_3);
    const isLessThan3pxInY = (Math.abs(lastY - firstY) <= CST.PIXEL_3);
    if (isLessThan3pxInX && isLessThan3pxInY) {
      this.pointStorage.deleteLastPosition();
      this.deleteLastPosition();
      this.deleteLastPosition();
      this.attributeD = this.attributeD + ' ' + this.pointStorage.storage[0].x + ',' + this.pointStorage.storage[0].y;
      this.lineContainer.setAttribute('points', this.attributeD);
    }
  }

  addDataToLine(): string {
    const pData = this.pointStorage.getStorage();
    const posX = pData[pData.length - 1].x;
    const posY = pData[pData.length - 1].y;

    if (this.forceAngleActivated) {
      const lastPosX = pData[pData.length - 2].x;
      const lastPosY = pData[pData.length - 2].y;
      const zone = this.getZone(pData);
      if (zone === '1') {
        this.pointStorage.deleteLastPosition();
        this.pointStorage.addToStorage(new Point2d(posX, lastPosY));
        return posX + ',' + lastPosY;
      }
      if (zone === '2') {
        const somme = lastPosY - posX + lastPosX;
        this.pointStorage.deleteLastPosition();
        this.pointStorage.addToStorage(new Point2d(posX, somme));
        return posX + ',' + somme;
      }
      if (zone === '3') {
        this.pointStorage.deleteLastPosition();
        this.pointStorage.addToStorage(new Point2d(lastPosX, posY));
        return lastPosX + ',' + posY;
      }
      if (zone === '4') {
        const somme = lastPosY + posX - lastPosX;
        this.pointStorage.deleteLastPosition();
        this.pointStorage.addToStorage(new Point2d(posX, somme));
        return posX + ',' + somme;
      } else {
        return posX + ',' + posY;
      }
    }
    return posX + ',' + posY;
  }

  getZone(pData: Point2d[]): string {
    const posX = pData[pData.length - 1].x;
    const posY = pData[pData.length - 1].y;
    const lastPosX = pData[pData.length - 2].x;
    const lastPosY = pData[pData.length - 2].y;
    const key1 = +(posX - lastPosX > 0);
    const key2 = +(posY - lastPosY < 0);
    const key3 = +(Math.abs(posX - lastPosX) > Math.abs(posY - lastPosY));
    let key4;

    if (key1 === key2) {
      if (key3 === 1) {
        key4 = +((lastPosY + lastPosY - (posX - lastPosX)) / 2 < posY);
      } else {
        key4 = +((lastPosX + lastPosX - (posY - lastPosY)) / 2 < posX);
      }
    } else {
      if (key3 === 1) {
        key4 = +((lastPosY + lastPosY + (posX - lastPosX)) / 2 < posY);
      } else {
        key4 = +((lastPosX + lastPosX + (posY - lastPosY)) / 2 < posX);
      }
    }
    const key = '' + key1 + key2 + key3 + key4;
    const ret = this.forceAngleSituation.get(key) as string;
    return ret;
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
    this.lineContainer.setAttribute('maximum', `${maximum.x}:${maximum.y}`);
    this.lineContainer.setAttribute('minimum', `${minimum.x}:${minimum.y}`);
    this.lineContainer.setAttribute('centerElement', `${centerElement.x}:${centerElement.y}`);
  }
}
