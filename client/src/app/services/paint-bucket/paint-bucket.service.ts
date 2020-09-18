import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@app/models/constants';
import { HashArrayPoint2d } from '@app/models/hash-array';
import { Node } from '@app/models/node';
import { Point2d } from '@app/models/point2d.class';
import { ToolInterface } from '@app/models/tool.interface';
import { AttributeService } from '../attribute/attribute.service';
import { ColorService } from '../color/color.service';
import { CommandManagerService } from '../command-manager/command-manager.service';
import { CommandDrawingService } from '../command/commands/drawing-command.service';
import { DrawingOptionService } from '../drawing-option/drawing-option.service';
import { SketchService } from '../sketch/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketService implements ToolInterface {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  refCANVAS: ElementRef;
  refIMG: ElementRef;
  hashBorder: HashArrayPoint2d;
  pointToVisit: Set<Point2d>;
  pointsChecked: Set<string>;
  color: string;
  toggledGrid: boolean;

  private valuesPointToVisit: IterableIterator<Point2d>;
  private context: CanvasRenderingContext2D;
  private img: string[][];
  private eventMemory: MouseEvent;
  private bucketInProgress: boolean;

  forTesting: boolean;
  // allborder: Point2d[];
  // newFill: HTMLElement;

  constructor(
    protected rendererFactory: RendererFactory2,
    public bg: DrawingOptionService,
    public attribute: AttributeService,
    public colorCore: ColorService,
    public sketch: SketchService,
    public commandManager: CommandManagerService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // this.allborder = new Array<Point2d>();
    this.pointToVisit = new Set<Point2d>();
    this.pointsChecked = new Set<string>();
    this.hashBorder = new HashArrayPoint2d();
    this.forTesting = true;
    this.toggledGrid = false;
  }

  // tslint:disable-next-line: no-empty
  shortcut(event: KeyboardEvent, isMouseUp: boolean): void { }

  // tslint:disable-next-line: no-empty
  draw(event: MouseEvent): void { }

  svgToCanvas(): void {
    const svgEle = this.elementSVG;
    const canvasEle = this.refCANVAS.nativeElement;
    const imgEle = this.refIMG.nativeElement;
    const xml = new XMLSerializer().serializeToString(svgEle);
    const imageBase64 = 'data:image/svg+xml;base64,' + btoa(xml);
    imgEle.src = imageBase64;
    this.context = canvasEle.getContext('2d') as CanvasRenderingContext2D;
    this.context.drawImage(imgEle, 0, 0);
    return;
  }

  colorToFill(p: Point2d): void {
    this.color = this.colorAt(p.x, p.y);
    // console.log(this.color);
  }

  colorAt(x: number, y: number): string {
    if (x < 0 || y < 0 || x > this.bg.width - 1 || y > this.bg.height - 1) { return '-1'; }
    return this.img[y][x];
  }

  // https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
  chunkArray(myArray: Uint8ClampedArray): string[][] {
    const chunkSize = 4;
    let index = 0;
    let x = 0;
    let y = CST.NEGATIVE;
    const tempArrayArray = new Array<string[]>();

    for (index = 0; index < myArray.length; index += chunkSize, x++) {

      if (x % this.bg.width === 0) {
        y++;
        tempArrayArray[y] = new Array<string>();
      }
      const myChunk = myArray.slice(index, index + chunkSize);
      tempArrayArray[y].push(myChunk.join(':'));

    }
    return tempArrayArray;
  }

  start(event: MouseEvent): void {
    // if (this.attribute.visibilityGrille === 'visible') {
    //   this.attribute.toggleGrille();
    //   this.toggledGrid = true;
    // }
    this.bucketInProgress = true;
    this.eventMemory = event;
    this.svgToCanvas();
  }

  end(): void {
    if (!this.bucketInProgress) { return; }
    // if (!this.forTesting) { return; }
    this.forTesting = false;
    this.svgToCanvas();
    const t1 = new Date();

    const click = new Point2d(this.eventMemory.offsetX, this.eventMemory.offsetY);

    // the 2 next line in 0.6 sec
    this.img = this.chunkArray(this.context.getImageData(0, 0, this.bg.width, this.bg.height).data) as string[][];
    this.colorToFill(click);

    this.floodFillAlgorithmModified(click);

    // this.drawForm in 0.023 sec
    this.drawForm();

    this.pointToVisit = new Set<Point2d>();
    this.pointsChecked = new Set<string>();
    // this.allborder = new Array<Point2d>();
    this.hashBorder = new HashArrayPoint2d();
    this.bucketInProgress = false;

    const t2 = new Date();
    const time = (t2.getTime() - t1.getTime()) / CST.MS_TO_SEC;
    console.log(`Finish in ${time} sec`);

    // if (this.toggledGrid) {
    //   this.attribute.toggleGrille();
    //   this.toggledGrid = false;
    // }
  }

  isSameColor(c: string): boolean {
    const color = this.color.replace(/rgb|a|\(|\)/gi, '').split(':').map((x) => parseInt(x, 10));
    const colorToValide = c.replace(/rgb|a|\(|\)/gi, '').split(':').map((x) => parseInt(x, 10));
    // console.log(color);
    const marge = parseInt(this.attribute.tolerance, 10) * CST.U_COLOR / CST.POURCENTAGE;
    if ((color[CST.RED] + marge >= colorToValide[CST.RED] && color[CST.RED] - marge <= colorToValide[CST.RED])) {
      if ((color[CST.GREEN] + marge >= colorToValide[CST.GREEN] && color[CST.GREEN] - marge <= colorToValide[CST.GREEN])) {
        if ((color[CST.BLUE] + marge >= colorToValide[CST.BLUE] && color[CST.BLUE] - marge <= colorToValide[CST.BLUE])) {
          return true;
        }
      }
    }
    return false;
  }

  border_add(p: Point2d): void {
    this.hashBorder.add(new Point2d(p.x, p.y));
    // this.allborder.push(new Point2d(p.x, p.y));
  }

  pointsChecked_add(s: string): void {
    this.pointsChecked.add(s);
  }

  pointToVisit_add(x: number, y: number): void {
    if (!this.pointsChecked.has(`${x}:${y}`)) {
      this.pointToVisit.add(new Point2d(x, y));
    }
  }

  floodFillAlgorithmModified(p: Point2d): void {
    // (if[lookAt]) in 0.73 sec
    this.valuesPointToVisit = this.pointToVisit.values();
    this.pointsChecked_add(`${p.x}:${p.y}`);
    while (true) {

      // if the color at the TOP is not Visited and the same color --> go there
      if (this.lookAtTop(p)) {
        p.y--;
        continue;
      }
      // if the color at the LEFT is not Visited and the same color --> go there
      if (this.lookAtLeft(p)) {
        p.x--;
        continue;
      }
      // if the color at the BOTTOM is not Visited and the same color --> go there
      if (this.lookAtBottom(p)) {
        p.y++;
        continue;
      }
      // if the color at the RIGHT is not Visited and the same color --> go there
      if (this.lookAtRight(p)) {
        p.x++;
        continue;
      }
      // this.pointsChecked_add(`${p.x}:${p.y}`);
      const nextPoint = this.valuesPointToVisit.next();
      if (nextPoint.done) { break; }
      p = nextPoint.value;
      continue;
    }
  }

  lookAtTop(p: Point2d): boolean { // TOP
    if (!(this.pointsChecked.has(`${p.x}:${p.y - 1}`))) {
      if (this.isSameColor(this.colorAt(p.x, p.y - 1))) {
        this.pointToVisit_add(p.x, p.y);
        this.pointsChecked_add(`${p.x}:${p.y}`);
        return true;
      } else {
        this.pointsChecked_add(`${p.x}:${p.y}`);
        const pt = { x: p.x, y: p.y - 1 } as Point2d;
        this.border_add(pt);
      }
    }
    return false;
  }

  lookAtLeft(p: Point2d): boolean { // LEFT
    if (!(this.pointsChecked.has(`${p.x - 1}:${p.y}`))) {
      if (this.isSameColor(this.colorAt(p.x - 1, p.y))) {
        this.pointToVisit_add(p.x, p.y);
        this.pointsChecked_add(`${p.x}:${p.y}`);
        return true;
      } else {
        this.pointsChecked_add(`${p.x}:${p.y}`);
        const pt = { x: p.x - 1, y: p.y } as Point2d;
        this.border_add(pt);
      }
    }
    return false;
  }

  lookAtRight(p: Point2d): boolean { // RIGHT
    if (!(this.pointsChecked.has(`${p.x + 1}:${p.y}`))) {
      if (this.isSameColor(this.colorAt(p.x + 1, p.y))) {
        this.pointToVisit_add(p.x, p.y);
        this.pointsChecked_add(`${p.x}:${p.y}`);
        return true;
      } else {
        this.pointsChecked_add(`${p.x}:${p.y}`);
        const pt = { x: p.x + 1, y: p.y } as Point2d;
        this.border_add(pt);
      }
    }
    return false;
  }

  lookAtBottom(p: Point2d): boolean { // BOTTOM
    if (!(this.pointsChecked.has(`${p.x}:${p.y + 1}`))) {
      if (this.isSameColor(this.colorAt(p.x, p.y + 1))) {
        this.pointToVisit_add(p.x, p.y);
        this.pointsChecked_add(`${p.x}:${p.y}`);
        return true;
      } else {
        this.pointsChecked_add(`${p.x}:${p.y}`);
        const pt = { x: p.x, y: p.y + 1 } as Point2d;
        this.border_add(pt);
      }
    }
    return false;
  }

  drawForm(): void {
    const newElementFloodFill = this.renderer.createElement('path', 'svg');
    const newElementG = this.renderer.createElement('g', 'svg');
    this.renderer.appendChild(newElementG, newElementFloodFill);
    this.renderer.appendChild(this.elementSVG, newElementG);
    // this.newFill = newElementFloodFill;
    newElementFloodFill.setAttribute('fill', this.colorCore.prime);
    // newElementFloodFill.setAttribute('fill', 'orange');
    newElementFloodFill.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    newElementFloodFill.setAttribute('angle', '0');
    newElementFloodFill.setAttribute('vectorTranslate', '0:0');
    newElementFloodFill.setAttribute('vectorScale', '1:1');
    newElementFloodFill.setAttribute('stroke-width', '0');
    newElementFloodFill.setAttribute('d', this.addDataToPath());

    this.sketch.add(newElementFloodFill);

    const command = new CommandDrawingService(this.sketch, newElementG, this.elementSVG);
    this.commandManager.add(command);
  }

  addDataToPath(): string {
    this.hashBorder.concat();
    let path = '';
    this.hashBorder.start.forEach((startNode) => {
      let it: Node<Point2d> | undefined = startNode;
      path += ` M${(it as Node<Point2d>).value.x},${(it as Node<Point2d>).value.y}`;
      do {
        path += ` L${(it as Node<Point2d>).value.x},${(it as Node<Point2d>).value.y}`;
        it = (it as Node<Point2d>).next;
      } while (typeof (it) !== 'undefined');
      path += ' Z';
      // this.newFill.setAttribute('d', path);
    });
    return path;
  }

}
