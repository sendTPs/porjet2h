import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {

  let service: RectangleService;
  const SHIFT_SHORTCUT_EVENT = { key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true } as KeyboardEvent;
  const ESCAPE_SHORTCUT_EVENT = { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const N100 = 100;
  const N50 = 50;
  const N30 = 30;
  const N25 = 25;
  const N10 = 10;
  const N5 = 5;

  beforeEach(() => {
    service = TestBed.get(RectangleService);
  });

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

  it('#draw should do nothing when drawPInProgress is false', () => {
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

  it('#getZone should return the right number depending on the sign of parameter', () => {

    const width1 = 1;
    const height1 = 1;
    expect(service.getZone(width1, height1)).toBe(CST.ZONE_1); // Zone 1

    const width2 = 1;
    const height2 = -1;
    expect(service.getZone(width2, height2)).toBe(CST.ZONE_2); // Zone 2

    const width3 = -1;
    const height3 = -1;
    expect(service.getZone(width3, height3)).toBe(CST.ZONE_3); // Zone 3

    const width4 = -1;
    const height4 = 1;
    expect(service.getZone(width4, height4)).toBe(CST.ZONE_4); // Zone 4

    const widthElse = 0;
    const heightElse = 0;
    expect(service.getZone(widthElse, heightElse)).toBe(CST.ZONE_4); // Zone 4
  });

  it('#shortcut should do nothing if shift key is not pressed', () => {
    spyOn(service, 'updatePosition').and.callThrough();
    service.shortcut(ESCAPE_SHORTCUT_EVENT, false);

    expect(service.updatePosition).not.toHaveBeenCalled();
    expect(service.activateSquare).toBe(service.activateSquare);

  });

  it('#shortcut should  do nothing if drawingInProgress is true', () => {
    service.drawingInProgress = false;
    service.activateSquare = true;
    spyOn(service, 'updatePosition').and.returnValue();
    service.shortcut(SHIFT_SHORTCUT_EVENT, true);
    expect(service.updatePosition).not.toHaveBeenCalled();
    expect(service.activateSquare).toBe(false);
  });

  it('#shortcut should call fonction if key is pressed, mouse is up and drawingInProgress is true', () => {
    service.drawingInProgress = true;
    service.activateSquare = true;
    spyOn(service, 'updatePosition').and.returnValue();
    service.shortcut(SHIFT_SHORTCUT_EVENT, true);
    expect(service.updatePosition).toHaveBeenCalled();
    expect(service.activateSquare).toBe(false);
  });

  it('#shortcut should only activate square if drawInProgress is false and key is pressed', () => {

    service.drawingInProgress = false;
    service.activateSquare = false;

    spyOn(service, 'updatePosition').and.returnValue();

    service.shortcut(SHIFT_SHORTCUT_EVENT, false);

    expect(service.activateSquare).toBe(true);
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

  it('#start should create a rectangle', () => {
    service.drawingInProgress = false;
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.start(click as MouseEvent);
    expect(service.drawingInProgress).toBeTruthy();
    expect(service.rectangleContainer).toBeDefined();
  });

  it('#searchPosition should set height and width to 1 when they are 0', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N10, N25));

    service.searchPosition(click as MouseEvent);
    expect(service.height).toBe(1);
    expect(service.width).toBe(1);

  });

  it('#searchPosition should go to zone 1 when height and with are positive', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N5, N5));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.width, service.height)).toBe(CST.ZONE_1);
  });

  it('#searchPosition should go to zone 2 when height is pos and width is neg', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N5, N30));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.width, service.height)).toBe(CST.ZONE_2);
  });

  it('#searchPosition should go to zone 3 when height and width are neg', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N30, N30));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.width, service.height)).toBe(CST.ZONE_3);
  });

  it('#searchPosition should go to zone 4 when height is neg and width is pos', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N30, N5));

    service.searchPosition(click as MouseEvent);
    expect(service.getZone(service.width, service.height)).toBe(CST.ZONE_4);
  });

  it('#updatePosition should work when square is activated', () => {
    const fakeRect = service.renderer.createElement('rect');
    fakeRect.setAttribute('height', '10');
    fakeRect.setAttribute('width', '10');
    service.rectangleContainer = fakeRect as HTMLElement;
    service.rectLength = 0;
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = N100;
    service.posY = N50;
    service.activateSquare = true;
    service.updatePosition();
    expect(service.rectangleContainer.getAttribute('height')).toBe('100');
    expect(service.rectangleContainer.getAttribute('width')).toBe('100');
  });

  it('#updatePosition should work when square is not activated', () => {
    const fakeRect = service.renderer.createElement('rect');
    fakeRect.setAttribute('height', '10');
    fakeRect.setAttribute('width', '10');
    service.rectangleContainer = fakeRect as HTMLElement;
    service.rectLength = 0;
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = N100;
    service.posY = N50;
    service.activateSquare = false;
    service.updatePosition();
    expect(service.rectangleContainer.getAttribute('height')).toBe('50');
    expect(service.rectangleContainer.getAttribute('width')).toBe('100');
  });

  it('#searchExtremum() should work', () => {
    service.rectangleContainer = service.renderer.createElement('polygon', 'svg');
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N50, N50));
    service.pointStorage.addToStorage(new Point2d(N10, N100));
    service.pointStorage.addToStorage(new Point2d(N100, N10));
    service.searchExtremum();
    const expect1 = service.rectangleContainer.getAttribute('minimum') as string;
    const expect2 = service.rectangleContainer.getAttribute('maximum') as string;
    expect(expect1).toBe('10:10');
    expect(expect2).toBe('100:100');
  });

});
