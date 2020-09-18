import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {

  let service: EllipseService;
  const SHIFT_RACCOURCI_EVENT = { key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true } as KeyboardEvent;
  const CTRL_RACCOURCI_EVENT = { key: 'CTRL', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const N100 = 100;
  const N50 = 50;
  const N30 = 30;
  const N25 = 25;
  const N10 = 10;
  const N5 = 5;

  beforeEach(() => { service = TestBed.get(EllipseService); });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#end should clear storage', () => {
    service.drawingInProgress = true;
    spyOn(service, 'searchExtremum').and.returnValue();
    const fctSpy = spyOn(service.pointStorage, 'clearStorage').and.returnValue();
    service.end();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#end should do nothing if drawingInProgress is false', () => {
    service.drawingInProgress = false;
    spyOn(service.pointStorage, 'clearStorage');
    service.end();
    expect(service.pointStorage.clearStorage).not.toHaveBeenCalled();
  });

  it('#end should set all pos attributes to 0 if drawingInProgress is true', () => {
    service.drawingInProgress = true;
    spyOn(service, 'searchExtremum').and.returnValue();
    service.end();
    expect(service.posX).toBe(0);
    expect(service.posY).toBe(0);
    expect(service.posX0).toBe(0);
    expect(service.posY0).toBe(0);
  });

  it('#draw should do nothing when drawInProgress is false', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');

    spyOn(service, 'updatePosition').and.callThrough();
    spyOn(service.pointStorage, 'addToStorage');
    service.drawingInProgress = false;
    service.draw(mouse);

    expect(service.pointStorage.addToStorage).not.toHaveBeenCalled();
    expect(service.updatePosition).not.toHaveBeenCalled();
  });

  it('#draw should call fonctions when drawInProgress is true', () => {
    const click = { offsetX: 20, offsetY: 30 };
    const svg = { accessKey: 'svg', offsetHeight: 10, offsetLeft: 15 };
    service.drawingInProgress = true;
    spyOn(service, 'searchPosition').and.callFake(() => 1);
    spyOn(service, 'updatePosition').and.callFake(() => svg as HTMLElement);

    service.draw(click as MouseEvent);
    expect(service.searchPosition).toHaveBeenCalled();
    expect(service.updatePosition).toHaveBeenCalled();
  });

  it('#getZone should return the right number depending on the value of parameter', () => {

    const X = 1;
    const Y = 1;
    expect(service.getZone(X, Y)).toBe(CST.ZONE_1); // Zone 1

    const X2 = 1;
    const Y2 = -1;
    expect(service.getZone(X2, Y2)).toBe(CST.ZONE_2); // Zone 2

    const X3 = -1;
    const Y3 = -1;
    expect(service.getZone(X3, Y3)).toBe(CST.ZONE_3); // Zone 3

    const X4 = -1;
    const Y4 = 1;
    expect(service.getZone(X4, Y4)).toBe(CST.ZONE_4); // Zone 4

    const X5 = 0;
    const Y5 = 0;
    expect(service.getZone(X5, Y5)).toBe(0);
  });

  it('#shortcut should do nothing if another key other than shift is pressed', () => {
    spyOn(service, 'updatePosition').and.callThrough();
    service.shortcut(CTRL_RACCOURCI_EVENT, false);

    expect(service.updatePosition).not.toHaveBeenCalled();
    expect(service.activateCircle).toBe(service.activateCircle);
  });

  it('#shortcut should  do nothing if drawingInProgress is true', () => {
    service.drawingInProgress = false;
    service.activateCircle = true;
    spyOn(service, 'updatePosition').and.returnValue();
    service.shortcut(SHIFT_RACCOURCI_EVENT, true);
    expect(service.updatePosition).not.toHaveBeenCalled();
    expect(service.activateCircle).toBe(false);
  });

  it('#shortcut should call fonction if key is pressed, mouse is up and drawingInProgress is true', () => {
    service.drawingInProgress = true;
    service.activateCircle = true;
    spyOn(service, 'updatePosition').and.returnValue();
    service.shortcut(SHIFT_RACCOURCI_EVENT, true);
    expect(service.updatePosition).toHaveBeenCalled();
    expect(service.activateCircle).toBe(false);
  });

  it('#shortcut should only activate square if drawInProgress is false and key is pressed', () => {

    service.drawingInProgress = false;
    service.activateCircle = false;

    spyOn(service, 'updatePosition').and.returnValue();

    service.shortcut(SHIFT_RACCOURCI_EVENT, false);

    expect(service.activateCircle).toBe(true);
    expect(service.updatePosition).not.toHaveBeenCalled();
  });

  it('#start should call a draw if drawingInProcess is true', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.drawingInProgress = true;
    const fctSpy = spyOn(service, 'draw').and.returnValue();
    service.start(click as MouseEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#start should create an ellipse', () => {
    service.drawingInProgress = false;
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.start(click as MouseEvent);
    expect(service.drawingInProgress).toBeTruthy();
    expect(service.ellipseContainer).toBeDefined();
  });

  it('#searchPosition should set radius x and y to 1 when they are 0', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N10, N25));

    service.searchPosition(click as MouseEvent);
    expect(service.radiusY).toBe(1);
    expect(service.radiusX).toBe(1);
  });

  it('#searchPosition should go to zone 1 when radius x and y are positive', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N5, N5));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.radiusX, service.radiusY)).toBe(CST.ZONE_1);
  });

  it('#searchPosition should go to zone 2 when radius y is pos and radius x is neg', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N5, N30));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.radiusX, service.radiusY)).toBe(CST.ZONE_2);
  });

  it('#searchPosition should go to zone 3 when radius x and y are neg', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N30, N30));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.radiusX, service.radiusY)).toBe(CST.ZONE_3);
  });

  it('#searchPosition should go to zone 4 when radrius Y is neg and radius X is pos', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N30, N5));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.radiusX, service.radiusY)).toBe(CST.ZONE_4);
  });

  it('#updatePosition should work when cirle is activated', () => {
    const fakeElli = service.renderer.createElement('ellipse');
    service.ellipseContainer = fakeElli as HTMLElement;
    service.radiusX = N25;
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = N100;
    service.posY = N50;
    service.activateCircle = true;
    service.updatePosition();

    expect(service.ellipseContainer.getAttribute('ry')).toBe('25');
    expect(service.ellipseContainer.getAttribute('rx')).toBe('25');
    expect(service.ellipseContainer.getAttribute('cx')).toBe('50');
  });

  it('#updatePosition should work when square is not activated', () => {
    const fakeRect = service.renderer.createElement('ellipse');
    service.ellipseContainer = fakeRect as HTMLElement;
    service.radiusX = N25;
    service.radiusY = N30;
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = N100;
    service.posY = N50;
    service.activateCircle = false;

    service.updatePosition();
    expect(service.ellipseContainer.getAttribute('ry')).toBe('30');
    expect(service.ellipseContainer.getAttribute('rx')).toBe('25');
  });

  it('#searchExtremum() should work', () => {
    service.ellipseContainer = service.renderer.createElement('polygon', 'svg');
    service.ellipseContainer.setAttribute('cx', '10');
    service.ellipseContainer.setAttribute('rx', '5');
    service.ellipseContainer.setAttribute('cy', '10');
    service.ellipseContainer.setAttribute('ry', '5');

    service.searchExtremum();
    const expectedMin = service.ellipseContainer.getAttribute('minimum') as string;
    const expectedMax = service.ellipseContainer.getAttribute('maximum') as string;
    expect(expectedMax).toBe('15:15');
    expect(expectedMin).toBe('5:5');
  });

});
