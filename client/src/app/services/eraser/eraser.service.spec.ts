import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';

import { EraserService } from './eraser.service';

describe('EraserService', () => {
  let service: EraserService;
  beforeEach(() => { service = TestBed.get(EraserService); });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 shortcut is a function and returns nothing', () => {
    service.shortcut();
    expect(service.shortcut).toEqual(jasmine.any(Function));
  });

  it('#1 start should begin erasing', () => {
    const click = { offsetX: 10, offsetY: 20 } as MouseEvent;
    spyOn(service, 'erasingElements').and.callThrough();

    service.start(click);
    expect(service.erasingInProcess).toBeTruthy();
    expect(service.erasingElements).toHaveBeenCalled();
  });

  it('#1 start should begin erasing', () => {
    const click = { offsetX: 10, offsetY: 20 } as MouseEvent;
    spyOn(service, 'erasingElements').and.callThrough();

    service.start(click);
    expect(service.erasingInProcess).toBeTruthy();
    expect(service.erasingElements).toHaveBeenCalled();
  });

  it('#2 eraseMarker should remove the square cursor', () => {
    const fakeSquare = service.renderer.createElement('rect');
    service.mouseSquare = fakeSquare as HTMLElement;
    spyOn(service.mouseSquare, 'remove').and.callThrough();

    service.eraseMarker();
    expect(service.isMouseSquare).toBeFalsy();
    expect(service.mouseSquare.remove).toHaveBeenCalled();
  });

  it('#2 eraseMarker should set bool to false even if cursor is undefined', () => {
    service.eraseMarker();
    expect(service.isMouseSquare).toBeFalsy();
  });

  it('#3 end should not erase if erasing isnt in process', () => {
    service.erasingInProcess = false;
    spyOn(service.sketch, 'delete').and.callThrough();

    service.end();
    expect(service.sketch.delete).not.toHaveBeenCalled();
  });

  it('#4 end should not erase if no elements are selected', () => {
    service.erasingInProcess = true;
    spyOn(service.sketch, 'delete').and.callThrough();

    service.end();
    expect(service.sketch.delete).not.toHaveBeenCalled();
  });

  it('#end should erase a rectangle properly', () => {
    const fakeElem = service.renderer.createElement('rect', 'svg') as HTMLElement;
    const fakeParent = service.renderer.createElement('g', 'svg') as HTMLElement;
    service.elementSVG = service.renderer.createElement('svg');
    service.elementSVG.appendChild(fakeParent);
    fakeParent.appendChild(fakeElem);
    service.selectedElements.push(fakeElem as HTMLElement);
    service.erasingInProcess = true;

    spyOn(service.elementSVG, 'removeChild').and.returnValue(fakeElem);
    spyOn(service.sketch, 'delete').and.callThrough();
    service.end();

    const expectedClass = fakeElem.getAttribute('class');
    expect(expectedClass).toBe(null);
    expect(service.sketch.delete).toHaveBeenCalled();
  });

  it('#end should erase a polyline properly', () => {
    const fakeElem = service.renderer.createElement('polyline', 'svg') as HTMLElement;
    const fakeParent = service.renderer.createElement('g', 'svg') as HTMLElement;
    service.elementSVG = service.renderer.createElement('svg');
    service.elementSVG.appendChild(fakeParent);
    fakeParent.appendChild(fakeElem);
    service.selectedElements.push(fakeElem as HTMLElement);
    service.erasingInProcess = true;

    spyOn(service.elementSVG, 'removeChild').and.returnValue(fakeElem);
    spyOn(service.sketch, 'delete').and.callThrough();
    service.end();

    const expectedClass = fakeElem.getAttribute('toolMark');
    expect(expectedClass).toBe(null);
    expect(service.sketch.delete).toHaveBeenCalled();
  });

  it('#draw should create a cursor if it hasnt been done and also erase elements', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.isMouseSquare = false;
    service.erasingInProcess = true;
    spyOn(service, 'createMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'updateMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'erasingElements').and.callFake(() => { return; });

    service.draw(fakeMouse);
    expect(service.createMouseSquare).toHaveBeenCalled();
    expect(service.updateMouseSquare).toHaveBeenCalled();
    expect(service.erasingElements).toHaveBeenCalled();
  });

  it('#draw should determine color', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.isMouseSquare = true;
    service.erasingInProcess = false;
    service.sketch.elementContainer.push(fakeMouse.target as HTMLElement);
    spyOn(service, 'createMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'updateMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'erasingElements').and.callFake(() => { return; });
    spyOn(service, 'determineColor').and.callFake(() => { return; });

    service.draw(fakeMouse);
    expect(service.createMouseSquare).not.toHaveBeenCalled();
    expect(service.determineColor).toHaveBeenCalled();
    expect(service.erasingElements).not.toHaveBeenCalled();
  });

  it('#draw should set proper class attribute is elem is a path', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.isMouseSquare = true;
    service.erasingInProcess = false;
    const fakePath = service.renderer.createElement('path', 'svg');
    service.sketch.elementContainer.push(fakePath as HTMLElement);

    spyOn(service, 'updateMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'isSelectedElement').and.callFake(() => false);

    service.draw(fakeMouse);
    const expectedClass = fakePath.getAttribute('class');
    expect(service.updateMouseSquare).toHaveBeenCalled();
    expect(expectedClass).toBe('toolMark');
  });

  it('#draw should remove class attribute for proper elements', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.isMouseSquare = true;
    service.erasingInProcess = false;
    const fakePath = service.renderer.createElement('rect', 'svg');
    service.sketch.elementContainer.push(fakePath as HTMLElement);

    spyOn(service, 'updateMouseSquare').and.callFake(() => { return; });
    spyOn(service, 'isSelectedElement').and.callFake(() => false);

    service.draw(fakeMouse);
    const expectedClass = fakePath.getAttribute('class');
    expect(service.updateMouseSquare).toHaveBeenCalled();
    expect(expectedClass).toBe(null);
  });

  it('#erasingElements should change color of selected elem', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    const fakePath = service.renderer.createElement('path');
    fakePath.setAttribute('points', '0,0');
    service.sketch.elementContainer.push(fakePath as HTMLElement);
    spyOn(service, 'isSelectedElement').and.callFake(() => true);
    spyOn(service.selectedElements, 'includes').and.callFake(() => false);
    spyOn(service, 'determineColor').and.callFake(() => { return; });

    service.erasingElements(fakeMouse);
    expect(service.determineColor).toHaveBeenCalled();
  });

  it('#erasingElements does nothing when element wanted isnt selected', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    const fakePath = service.renderer.createElement('path');
    fakePath.setAttribute('points', '0,0');
    service.sketch.elementContainer.push(fakePath as HTMLElement);
    spyOn(service.selectedElements, 'includes').and.callFake(() => true);
    spyOn(service, 'determineColor').and.callFake(() => { return; });

    service.erasingElements(fakeMouse);
    expect(service.determineColor).not.toHaveBeenCalled();
  });

  it('#isSelectedElement returns false when element isnt bounded on right', () => {
    const mouseEvent = { offsetX: 2, offsetY: 20, clientX: 20, clientY: 30 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 30, right: 5, width: 10, height: 10 } as DOMRect;
    const fakePath = service.renderer.createElement('rect', 'svg') as HTMLElement;
    spyOn(fakePath, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);

    expect(service.isSelectedElement(fakePath, mouseEvent)).toBeFalsy();
  });

  it('#isSelectedElement returns false when element isnt bounded on left', () => {
    const mouseEvent = { offsetX: 2, offsetY: 20, clientX: 20, clientY: 30 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 5, right: 5, width: 10, height: 10 } as DOMRect;
    const fakePath = service.renderer.createElement('rect', 'svg') as HTMLElement;
    spyOn(fakePath, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);

    expect(service.isSelectedElement(fakePath, mouseEvent)).toBeFalsy();
  });

  it('#isSelectedElement returns false when element isnt bounded on top', () => {
    const mouseEvent = { offsetX: 2, offsetY: 20, clientX: 20, clientY: 5 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 5, right: 35, top: 10, bottom: 10 } as DOMRect;
    const fakePath = service.renderer.createElement('rect', 'svg') as HTMLElement;
    spyOn(fakePath, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);

    expect(service.isSelectedElement(fakePath, mouseEvent)).toBeFalsy();
  });

  it('#isSelectedElement returns false when element isnt bounded on bottom', () => {
    const mouseEvent = { offsetX: 2, offsetY: 20, clientX: 20, clientY: 15 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 5, right: 35, top: 10, bottom: 10 } as DOMRect;
    const fakePath = service.renderer.createElement('rect', 'svg') as HTMLElement;
    spyOn(fakePath, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);

    expect(service.isSelectedElement(fakePath, mouseEvent)).toBeFalsy();
  });

  it('#isSelectedElement calls checkPoint when element is a path', () => {
    const mouseEvent = { offsetX: 10, offsetY: 2, clientX: 10, clientY: 2 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 5, right: 15, top: 0, bottom: 10 } as DOMRect;
    const fakePath = service.renderer.createElement('path', 'svg') as HTMLElement;
    fakePath.setAttribute('d', 'M 10,30');
    spyOn(fakePath, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);
    spyOn(service, 'checkPoint').and.callFake(() => true);

    service.isSelectedElement(fakePath, mouseEvent);
    expect(service.checkPoint).toBeTruthy();
  });

  it('#isSelectedElement calls checkPoint when element is a polygon', () => {
    const mouseEvent = { offsetX: 10, offsetY: 2, clientX: 10, clientY: 2 } as MouseEvent;
    service.width.width = '0';
    const fakeBound = { left: 5, right: 15, top: 0, bottom: 10 } as DOMRect;
    const fakeElem = service.renderer.createElement('polygon', 'svg') as HTMLElement;
    fakeElem.setAttribute('points', '0,0 0,0');
    spyOn(fakeElem, 'getBoundingClientRect').and.returnValue(fakeBound as unknown as DOMRect);
    spyOn(service, 'checkPoint').and.callFake(() => true);

    service.isSelectedElement(fakeElem, mouseEvent);
    expect(service.checkPoint).toBeTruthy();
  });

  it('#checkPoint returns true', () => {
    const vingt = 20;
    const fakePoint: string[][] = [['10', '10'], ['0', '0']];
    expect(service.checkPoint(fakePoint, 1, vingt, 1, vingt)).toBeTruthy();
  });

  it('#checkPoint does nothing when element wanted isnt selected', () => {
    const vingt = 20;
    const fakePoint: string[][] = [['10', '10'], ['0', '0']];
    expect(service.checkPoint(fakePoint, vingt, 1, vingt, 1)).toBeFalsy();
  });

  it('#determineColor should set elem to red', () => {
    const fakePath = service.renderer.createElement('rect');
    fakePath.setAttribute('stroke', 'black');

    service.determineColor(fakePath as HTMLElement);
    const newColor = fakePath.getAttribute('class');
    expect(newColor).toBe('eraserIndicatorShape');
  });

  it('#determineColor should set red elem to darker red', () => {
    const fakePath = service.renderer.createElement('rect');
    fakePath.setAttribute('stroke', 'rgb(255,0,0)');

    service.determineColor(fakePath as HTMLElement);
    const newColor = fakePath.getAttribute('class');
    expect(newColor).toBe('darkerRedShape');
  });

  it('#determineColor should set pencil line to red', () => {
    const fakePath = service.renderer.createElement('polyline', 'svg');

    service.determineColor(fakePath as HTMLElement);
    const newColor = fakePath.getAttribute('class');
    expect(newColor).toBe('eraserIndicatorLine');
  });

  it('#determineColor should set red pencil to darker red', () => {
    const fakePath = service.renderer.createElement('polyline', 'svg');
    fakePath.setAttribute('stroke', 'rgb(255,0,0)');

    service.determineColor(fakePath as HTMLElement);
    const newColor = fakePath.getAttribute('class');
    expect(newColor).toBe('darkerRedLine');
  });

  it('#createMouseSquare creates new square cursor', () => {
    service.elementSVG = service.renderer.createElement('svg');
    spyOn(service.renderer, 'appendChild').and.callThrough();

    service.createMouseSquare();
    const expectedClass = service.mouseSquare.getAttribute('class');

    expect(service.isMouseSquare).toBeTruthy();
    expect(expectedClass).toBe('zIndex');
    expect(service.renderer.appendChild).toHaveBeenCalled();
  });

  it('#updateMouseSquare sets eraser width to 3px if its lower', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.elementSVG = service.renderer.createElement('svg');
    service.width.width = '1';

    service.createMouseSquare();
    service.updateMouseSquare(fakeMouse);
    const expectedWidth = service.mouseSquare.getAttribute('width');

    expect(expectedWidth).toBe('3');
  });

  it('#updateMouseSquare sets eraser correctly', () => {
    const fakeMouse: MouseEvent = new MouseEvent('mousedown') as MouseEvent;
    service.elementSVG = service.renderer.createElement('svg');
    service.width.width = '8';

    service.createMouseSquare();
    service.updateMouseSquare(fakeMouse);
    const expectedWidth = service.mouseSquare.getAttribute('width');

    expect(expectedWidth).toBe('8');
  });

  it('#setCursor should remove current cursor when activate erase tool', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.tool.tool = CST.ERASER_KEY;

    service.createMouseSquare();
    service.setCursor();
    const expectedClass = service.elementSVG.getAttribute('class');

    expect(expectedClass).toBe('noCursor');
  });

  it('#setCursor should remove square cursor when eraser isnt activated', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.tool.tool = CST.PENCIL_KEY;

    service.createMouseSquare();
    spyOn(service.mouseSquare, 'remove').and.callThrough();
    service.setCursor();
    const expectedClass = service.elementSVG.getAttribute('class');

    expect(service.mouseSquare.remove).toHaveBeenCalled();
    expect(expectedClass).toBe('wsSVGClass');
  });

  it('#setCursor should not remove mouse square if it isnt set', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.tool.tool = CST.PENCIL_KEY;

    service.setCursor();
    const expectedClass = service.elementSVG.getAttribute('class');
    expect(expectedClass).toBe('wsSVGClass');
  });
  // tslint:disable: max-file-line-count
});
