import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';
import { Data } from '@models/data-elements.class';
import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  let service: SelectionService;
  let storageSpy: jasmine.SpyObj<PointStorageService>;

  const N20 = 20;
  const N10 = 10;
  const N4 = 4;
  const N2 = 2;
  const N1 = 1;

  const RANDOM = { key: 'random', ctrlKey: true, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;
  const SELECT_ALL = { key: 'a', ctrlKey: true, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;
  const LEFT = { key: 'ArrowLeft', ctrlKey: false, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;
  const RIGHT = { key: 'ArrowRight', ctrlKey: false, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;
  const UP = { key: 'ArrowUp', ctrlKey: false, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;
  const DOWN = { key: 'ArrowDown', ctrlKey: false, altKey: false, shiftKey: false, preventDefault: () => { return; } } as KeyboardEvent;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage', 'deleteLastPosition']);
    TestBed.configureTestingModule({
      providers: [
        SelectionService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(SelectionService);
    storageSpy = TestBed.get(PointStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 shortcut() should NOT do something#', () => {
    service.elementActionG = {} as HTMLElement;
    const fctSpy1 = spyOn(service, 'end').and.returnValue();
    const fctSpy2 = spyOn(service.move, 'mouseMove').and.returnValue();
    service.shortcut(RANDOM, true);
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();

  });

  it('#2 shortcut() should move all#', () => {
    const fctSpy = spyOn(service, 'end').and.returnValue();
    service.shortcut(SELECT_ALL, false);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#3 shortcut() should work for up-down-left-right#', () => {
    service.elementActionG = {} as HTMLElement;
    const fctSpy1 = spyOn(service.move, 'mouseMove').and.returnValue();
    service.shortcut(LEFT, false);
    service.shortcut(RIGHT, false);
    service.shortcut(UP, false);
    service.shortcut(DOWN, false);
    expect(fctSpy1).toHaveBeenCalledTimes(N4);
  });

  it('#3.1 shortcut() should NOT work for up-down-left-right cause by undefined elementActionG#', () => {
    const fctSpy1 = spyOn(service.move, 'mouseMove').and.returnValue();
    service.shortcut(LEFT, false);
    service.shortcut(RIGHT, false);
    service.shortcut(UP, false);
    service.shortcut(DOWN, false);
    expect(fctSpy1).not.toHaveBeenCalledTimes(N4);
  });

  it('#4 shortcut() should NOT work for up-down-left-right#', () => {
    const fctSpy1 = spyOn(service.move, 'mouseMove').and.returnValue();
    service.shortcut(LEFT, true);
    service.shortcut(RIGHT, true);
    service.shortcut(UP, true);
    service.shortcut(DOWN, true);
    expect(fctSpy1).not.toHaveBeenCalledTimes(N4);
  });

  it('#5 start() should call a draw if drawingInProcess is true', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 } as MouseEvent;
    service.drawingInProcess = true;
    const fctSpy = spyOn(service, 'draw').and.returnValue();
    service.start(click);
    expect(service.drawingInProcess).toBeTruthy();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#6 start() should create a line', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 } as MouseEvent;
    const fctSpy = spyOn(service.renderer, 'appendChild');
    service.start(click);
    expect(service.drawingInProcess).toBeTruthy();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#7 end() should do nothing', () => {
    service.drawingInProcess = false;
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(storageSpy.clearStorage).not.toHaveBeenCalled();
  });

  it('#8 end() should call createRectangleAction1#', () => {
    service.elementActionG = service.renderer.createElement('g', 'svg');
    service.elementSVG = service.renderer.createElement('svg');
    service.selectionContainer = service.renderer.createElement('rect', 'svg');
    service.elementSVG.appendChild(service.elementActionG);
    service.elementSVG.appendChild(service.selectionContainer);
    service.drawingInProcess = true;
    service.selectionBoxCreated = true;
    storageSpy.clearStorage.and.returnValue();
    const fctSpy1 = spyOn(service.logic, 'selectedByRectangle').and.returnValue(true);
    const fctSpy2 = spyOn(service.logic, 'selectedByClick').and.returnValue(true);
    const fctSpy3 = spyOn(service, 'createRectangleAction').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(fctSpy1).toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();
    expect(fctSpy3).toHaveBeenCalled();
  });

  it('#9 end() should call createRectangleAction2#', () => {
    service.drawingInProcess = true;
    service.selectionBoxCreated = false;
    storageSpy.clearStorage.and.returnValue();
    const fctSpy1 = spyOn(service.logic, 'selectedByRectangle').and.returnValue(true);
    const fctSpy2 = spyOn(service.logic, 'selectedByClick').and.returnValue(true);
    const fctSpy3 = spyOn(service, 'createRectangleAction').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).toHaveBeenCalled();
    expect(fctSpy3).toHaveBeenCalled();
  });

  it('#10 end() should NOT call createRectangleAction1#', () => {
    service.drawingInProcess = true;
    service.selectionBoxCreated = true;
    storageSpy.clearStorage.and.returnValue();
    const fctSpy1 = spyOn(service.logic, 'selectedByRectangle').and.returnValue(false);
    const fctSpy2 = spyOn(service.logic, 'selectedByClick').and.returnValue(false);
    const fctSpy3 = spyOn(service, 'createRectangleAction').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(fctSpy1).toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();
    expect(fctSpy3).not.toHaveBeenCalled();
  });

  it('#11 end() should NOT call createRectangleAction2#', () => {
    service.drawingInProcess = true;
    service.selectionBoxCreated = false;
    storageSpy.clearStorage.and.returnValue();
    const fctSpy1 = spyOn(service.logic, 'selectedByRectangle').and.returnValue(false);
    const fctSpy2 = spyOn(service.logic, 'selectedByClick').and.returnValue(false);
    const fctSpy3 = spyOn(service, 'createRectangleAction').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).toHaveBeenCalled();
    expect(fctSpy3).not.toHaveBeenCalled();
  });

  it('#12 draw() should do nothing when drawProcess is false#', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    service.drawingInProcess = false;
    spyOn(service, 'searchPosition').and.returnValue();
    spyOn(service, 'updatePosition').and.returnValue();
    service.draw(mouse);
    expect(service.updatePosition).not.toHaveBeenCalled();
  });

  it('#13 draw() should do something when drawProcess is true#', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    service.drawingInProcess = true;
    spyOn(service, 'searchPosition').and.returnValue();
    spyOn(service, 'updatePosition').and.returnValue();
    service.draw(mouse);
    expect(service.updatePosition).toHaveBeenCalled();
  });

  it('#14 searchPosition() should work in the 4 zones#', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    const fctSpy = spyOn(service.logic, 'getZone');
    const mouse1 = { offsetX: 20, offsetY: 20 } as MouseEvent;
    fctSpy.and.returnValue(CST.ZONE_1);
    service.searchPosition(mouse1);
    expect(service.logic.finalSelect.x).toBe(N20);
    expect(service.logic.finalSelect.y).toBe(N20);
    const mouse2 = { offsetX: 20, offsetY: 0 } as MouseEvent;
    fctSpy.and.returnValue(CST.ZONE_2);
    service.searchPosition(mouse2);
    expect(service.logic.finalSelect.x).toBe(N20);
    expect(service.logic.finalSelect.y).toBe(N10);
    const mouse3 = { offsetX: 0, offsetY: 0 } as MouseEvent;
    fctSpy.and.returnValue(CST.ZONE_3);
    service.searchPosition(mouse3);
    expect(service.logic.finalSelect.x).toBe(N10);
    expect(service.logic.finalSelect.y).toBe(N10);
    const mouse4 = { offsetX: 0, offsetY: 20 } as MouseEvent;
    fctSpy.and.returnValue(CST.ZONE_4);
    service.searchPosition(mouse4);
    expect(service.logic.finalSelect.x).toBe(N10);
    expect(service.logic.finalSelect.y).toBe(N20);
  });

  it('#19 erase() should erase nothing#', () => {
    const fctSpy = spyOn(service.logic, 'clearSelectedElement').and.returnValue();
    service.erase();
    expect(fctSpy).not.toHaveBeenCalled();
  });

  it('#20 erase() should erase the good element#', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.elementActionG = service.renderer.createElement('rect', 'svg');
    service.renderer.appendChild(service.elementSVG, service.elementActionG);
    const fctSpy = spyOn(service.logic, 'clearSelectedElement').and.returnValue();
    service.erase();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#21 createRectangleAction() should create a element#', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.logic.init = new Point2d();
    service.logic.final = new Point2d();
    service.logic.init.x = N1;
    service.logic.init.y = N2;
    service.logic.final.x = N10;
    service.logic.final.y = N20;
    spyOn(service, 'createElement').and.returnValue(false);
    service.createRectangleAction();
    spyOn(service.rotate, 'wheelUse').and.returnValue();
    (service.elementActionG.children[0] as HTMLElement).dispatchEvent(new Event('wheel'));
    expect(service.logic.elementSelected).toBeDefined();
  });

  it('#22 createElement() should create a element #', () => {
    service.elementActionG = service.renderer.createElement('g', 'svg');
    const data0 = new Data(0, 0, 2, 0, 0, 2, 'nothing', 'move');
    const data1 = new Data(N10, N20, 2, N10, N20, 2, 'center', 'move');
    const data2 = new Data(N10, 0, 1, N10, N20, 2, 'left', 'e-resize');
    const data3 = new Data(0, N20, 1, N10, N20, 2, 'right', 'e-resize');
    const data4 = new Data(N10, N20, 2, N10, 0, 1, 'up', 'n-resize');
    const data5 = new Data(N10, N20, 2, 0, N20, 1, 'down', 'n-resize');
    const expect0 = service.createElement(data0);
    const expect1 = service.createElement(data1);
    const expect2 = service.createElement(data2);
    const expect3 = service.createElement(data3);
    const expect4 = service.createElement(data4);
    const expect5 = service.createElement(data5);
    expect(expect0).toBeFalsy();
    expect(expect1).toBeTruthy();
    expect(expect2).toBeTruthy();
    expect(expect3).toBeTruthy();
    expect(expect4).toBeTruthy();
    expect(expect5).toBeTruthy();
    spyOn(service.move, 'mouseDown').and.returnValue();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < service.elementActionG.children.length; i++) {
      const it = service.elementActionG.children[i] as HTMLElement;
      it.dispatchEvent(new Event('mousedown'));
      it.dispatchEvent(new Event('mouseenter'));
      it.dispatchEvent(new Event('mouseleave'));
      it.dispatchEvent(new Event('wheel'));
    }

  });

  it('#24 updatePosition() should update the position#', () => {
    service.logic.initSelect = new Point2d(N20, N20);
    service.logic.finalSelect = new Point2d(N10, N10);
    service.selectionContainer = service.renderer.createElement('rect', 'svg');
    service.updatePosition();
    const expect1 = service.selectionContainer.getAttribute('x') as string;
    const expect2 = service.selectionContainer.getAttribute('y') as string;
    const expect3 = service.selectionContainer.getAttribute('height') as string;
    const expect4 = service.selectionContainer.getAttribute('width') as string;
    expect(expect1).toBe(N20.toString());
    expect(expect2).toBe(N20.toString());
    expect(expect3).toBe(N10.toString());
    expect(expect4).toBe(N10.toString());
  });
});
