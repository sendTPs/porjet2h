import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { Node } from '@app/models/node';
import { Point2d } from '@app/models/point2d.class';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
  let service: PaintBucketService;
  const OUT = '-1';
  const b = '255:255:255:255';
  const N = '0:0:0:255';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaintBucketService]
    });
    service = TestBed.get(PaintBucketService);
    // tslint:disable: no-string-literal
    service['img'] = [ // 8 x 8
      [b, b, b, b, b, b, b, b],
      [b, N, N, N, N, N, b, b],
      [b, N, b, b, b, N, N, b],
      [b, N, b, b, b, N, N, b],
      [b, N, b, b, b, b, N, b],
      [b, N, N, b, b, N, N, b],
      [b, b, N, N, N, N, b, b],
      [b, b, b, N, b, b, b, b]
    ];
    // tslint:disable: no-magic-numbers
    service.bg.width = 8;
    service.bg.height = 8;
    service['context'] = {
      getImageData: (sx, sy, sw, sh) => {
        return {
          data: [0, 0, 0, 0]
        } as unknown as ImageData;
      }
    } as CanvasRenderingContext2D;
  });

  it('should be created', () => {
    service.draw({} as MouseEvent);
    service.shortcut({} as KeyboardEvent, true);
    expect(service).toBeTruthy();
  });

  it('#1 start() should set bucketInProgress to TRUE and memorize the event', () => {
    spyOn(service, 'svgToCanvas').and.returnValue();
    service.start({ x: 2, y: 1 } as MouseEvent);
    expect(service['bucketInProgress']).toBeTruthy();
    expect(service['eventMemory']).toEqual({ x: 2, y: 1 } as MouseEvent);
  });

  it('#2 colorToFill() should get the color to switch', () => {
    service['img'] = [['0:0'], ['1:0', '1:1', 'red:green:blue:255'], ['2:0'], ['3:0']];
    service.colorToFill(new Point2d(2, 1));
    expect(service.color).toBe('red:green:blue:255');
  });

  it('#3 colorAt() should return the color of the pixel (y,x)', () => {
    expect(service.colorAt(2, 1)).toBe(N);
  });

  it('#4 colorAt() should return -1 for a pixel Out of Bound (y,x)', () => {
    expect(service.colorAt(-1, -1)).toBe(OUT);
    expect(service.colorAt(10, 10)).toBe(OUT);
  });

  it('#5 svgToCanvas should define and return a canvas context', () => {
    service.elementSVG = document.createElement('svg');
    const canvasElement = document.createElement('canvas');
    const imageElement = document.createElement('img');
    service.refCANVAS = new ElementRef(canvasElement);
    service.refIMG = new ElementRef(imageElement);
    service.svgToCanvas();
    expect(service['context']).toBeDefined();
  });

  it('#6 chunkArray() should chunk a single array (number[]) into double Array (string[][])', () => {
    const array = [0, 0, 8, 8, 1, 0, 8, 8, 2, 0, 8, 8, 0, 1, 8, 8, 1, 1, 8, 8, 2, 1, 8, 8] as unknown as Uint8ClampedArray;
    service.bg.width = 3;
    service.bg.height = 2;
    const expectArray = [
      ['0:0:8:8', '1:0:8:8', '2:0:8:8'],
      ['0:1:8:8', '1:1:8:8', '2:1:8:8']
    ];
    expect(service.chunkArray(array)).toEqual(expectArray);
  });

  it('#7 isSameColor() should return TRUE if the color are the same with the tolerance, otherwise FALSE', () => {
    service.color = '255:128:0:255';
    service.attribute.tolerance = '60';
    expect(service.isSameColor('128:128:128:255')).toBe(true);
    service.attribute.tolerance = '40';
    expect(service.isSameColor('128:128:128:255')).toBe(false);
    service.attribute.tolerance = '0';
    expect(service.isSameColor('255:0:0:255')).toBe(false);
    expect(service.isSameColor('255:128:255:255')).toBe(false);
  });

  it('#8 pointToVisit_add() should add a Point if the Point isnt already checked', () => {
    service.pointToVisit_add(1, 1);
    expect(service.pointToVisit.size === 1).toBe(true);
    service.pointToVisit_add(1, 1);
    expect(service.pointToVisit.size === 2).toBe(true);
    service.pointsChecked_add('2:2');
    service.pointToVisit_add(2, 2);
    expect(service.pointToVisit.size === 2).toBe(true);
  });

  it('#9 border_add() should add a Point', () => {
    service.border_add(new Point2d(2, 2));
    expect(service.hashBorder.start.length === 1).toBe(true);
  });

  it('#10 lookAtTop() should return TRUE if the Point at the top isnt checked and is the same color, otherwise FALSE', () => {
    service.color = N;
    expect(service.lookAtTop(new Point2d(2, 2))).toBe(true);
    service.color = b;
    expect(service.lookAtTop(new Point2d(2, 2))).toBe(false);
    service.pointsChecked.add('2:1');
    expect(service.lookAtTop(new Point2d(2, 2))).toBe(false);
  });

  it('#11 lookAtLeft() should return TRUE if the Point at the top isnt checked and is the same color, otherwise FALSE', () => {
    service.color = N;
    expect(service.lookAtLeft(new Point2d(2, 2))).toBe(true);
    service.color = b;
    expect(service.lookAtLeft(new Point2d(2, 2))).toBe(false);
    service.pointsChecked.add('2:1');
    expect(service.lookAtLeft(new Point2d(2, 2))).toBe(false);
  });

  it('#12 lookAtRight() should return TRUE if the Point at the top isnt checked and is the same color, otherwise FALSE', () => {
    service.color = b;
    expect(service.lookAtRight(new Point2d(2, 2))).toBe(true);
    service.color = N;
    expect(service.lookAtRight(new Point2d(2, 2))).toBe(false);
    service.pointsChecked.add('2:1');
    expect(service.lookAtRight(new Point2d(2, 2))).toBe(false);
  });

  it('#13 lookAtBottom() should return TRUE if the Point at the top isnt checked and is the same color, otherwise FALSE', () => {
    service.color = b;
    expect(service.lookAtBottom(new Point2d(2, 2))).toBe(true);
    service.color = N;
    expect(service.lookAtBottom(new Point2d(2, 2))).toBe(false);
    service.pointsChecked.add('2:1');
    expect(service.lookAtBottom(new Point2d(2, 2))).toBe(false);
  });

  it('#14 drawForm() should append a new form', () => {
    service.elementSVG = document.createElement('svg');
    spyOn(service, 'addDataToPath').and.returnValue('M0,0 L10,10');
    service.drawForm();
    expect(service.elementSVG.childNodes.length === 1).toBe(true);
  });

  it('#15 addDataToPath() should return the good path', () => {
    const node1 = new Node<Point2d>(new Point2d(0, 0));
    const node2 = new Node<Point2d>(new Point2d(0, 1));
    const node3 = new Node<Point2d>(new Point2d(0, 2));
    node1.next = node2;
    node2.next = node3;
    node2.previous = node1;
    node3.previous = node2;
    service.hashBorder.start.push(node1);
    service.hashBorder.end.push(node3);
    expect(service.addDataToPath()).toBe(' M0,0 L0,0 L0,1 L0,2 Z');
  });

  it('#16 floodFillAlgorithmModified() should search in the draw for finding the good border', () => {
    const pathBorderExpect = ' M5,5 L5,5 L4,6 L3,6 L2,5 L1,4 L1,3 L1,2 L2,1 L3,1 L4,1 L5,2 L5,3 L6,4 Z';
    service.color = b;
    service.floodFillAlgorithmModified(new Point2d(3, 4));
    expect(service.addDataToPath()).toBe(pathBorderExpect);
  });

  it('#18 end() should do nothing when bucketInProgress is FALSE', () => {
    service['bucketInProgress'] = false;
    const spy = spyOn(service, 'svgToCanvas');
    service.end();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#19 end() should call each function who has been tested earlier', () => {
    service['bucketInProgress'] = true;
    service['eventMemory'] = { offsetX: 2, offsetY: 2 } as MouseEvent;
    const spy1 = spyOn(service, 'chunkArray').and.returnValue(service['img']);
    const spy2 = spyOn(service, 'svgToCanvas').and.returnValue();
    const spy3 = spyOn(service, 'floodFillAlgorithmModified').and.returnValue();
    const spy4 = spyOn(service, 'drawForm').and.returnValue();
    service.end();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

});
