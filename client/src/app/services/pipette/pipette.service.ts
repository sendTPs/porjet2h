import { ElementRef, Injectable } from '@angular/core';

import * as CST from '@models/constants';
import { ToolInterface } from '@models/tool.interface';

import { ColorService } from '@services/color/color.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService implements ToolInterface {

  svgTag: ElementRef;
  canvasTag: ElementRef;
  imageTag: ElementRef;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  pickedColor: string;
  eventMemory: MouseEvent;
  context: CanvasRenderingContext2D;
  pipetteInProgress: boolean;

  constructor(public color: ColorService) { }

  draw(): void { return; }
  shortcut(): void { return; }

  start(event: MouseEvent): void {
    this.pipetteInProgress = true;
    this.eventMemory = event;
    this.svgToCanvas();
  }

  end(): void {
    if (!this.pipetteInProgress) { return; }
    this.pickColor(this.eventMemory);
    this.pipetteInProgress = false;
  }

  setSvgTag(tag: ElementRef): void {
    this.svgTag = tag;
  }
  setCanvasTag(tag: ElementRef): void {
    this.canvasTag = tag;
  }
  setImageTag(tag: ElementRef): void {
    this.imageTag = tag;
  }

  svgToCanvas(): void {
    const canvasEle = this.canvasTag.nativeElement;
    const svgEle = this.svgTag.nativeElement;
    const xml = new XMLSerializer().serializeToString(svgEle);
    const imgEle = this.imageTag.nativeElement;
    const imageBase64 = 'data:image/svg+xml;base64,' + btoa(xml);
    imgEle.src = imageBase64;
    this.context = canvasEle.getContext('2d') as CanvasRenderingContext2D;
    this.context.drawImage(imgEle, 0, 0);
    return;
  }

  pickColor(event: MouseEvent): void {
    this.svgToCanvas();
    this.getColorData(this.context, event);
    this.changeColor(this.pickedColor, event);
  }

  changeColor(color: string, event: MouseEvent): void {
    if (event.button === 0) {
      this.color.prime = color;
    } else if (event.button === 2) {
      this.color.second = color;
    }
  }

  getColorData(canvasContext: CanvasRenderingContext2D, event: MouseEvent): void {
    const data = canvasContext.getImageData(event.offsetX, event.offsetY, event.offsetX, event.offsetY);
    this.pickedColor =
      'rgb(' + data.data[CST.RED] + ',' + data.data[CST.GREEN] + ',' + data.data[CST.BLUE] + ')';
    return;
  }
}
