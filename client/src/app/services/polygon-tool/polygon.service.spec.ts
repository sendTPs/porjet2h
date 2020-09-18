import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  let service: PolygonService;

  const N25 = 25;
  const N10 = 10;
  const N100 = 100;
  const N50 = 50;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage', 'deleteLastPosition']);
    TestBed.configureTestingModule({
      providers: [
        PolygonService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(PolygonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#shortcut() should do nothing', () => {
    const click = {} as KeyboardEvent;
    service.shortcut(click, false);
    expect(service.drawingInProgress).toBe(false);
  });

  it('#end() should clear storage', () => {
    service.drawingInProgress = true;
    spyOn(service, 'searchExtremum').and.returnValue();
    service.polygonContainer = service.renderer.createElement('rect', 'svg');
    service.end();
    expect(service.drawingInProgress).toBeFalsy();
  });

  it('#end() should do nothing if drawingInProgress is false', () => {
    service.drawingInProgress = false;
    service.end();
    expect(service.pointStorage.clearStorage).not.toHaveBeenCalled();
  });

  it('#draw() should do nothing when drawPInProgress is false', () => {
    const mouse = { offsetX: 10, offsetY: 10 } as MouseEvent;

    spyOn(service, 'updatePosition').and.returnValue();
    service.drawingInProgress = false;
    service.draw(mouse);

    expect(service.pointStorage.addToStorage).not.toHaveBeenCalled();
    expect(service.updatePosition).not.toHaveBeenCalled();
  });

  it('#draw() should call fonctions when drawInProgress is true', () => {
    const click = { offsetX: 20, offsetY: 30 };
    service.drawingInProgress = true;
    spyOn(service, 'searchPosition').and.returnValue();
    spyOn(service, 'updatePosition').and.returnValue();
    service.draw(click as MouseEvent);
    expect(service.searchPosition).toHaveBeenCalled();
    expect(service.updatePosition).toHaveBeenCalled();
  });

  it('#getZone() should return the right number depending on the sign of parameter', () => {

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

  it('#start() should call a draw if drawingInProcess is true', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.drawingInProgress = true;
    const fctSpy = spyOn(service, 'draw').and.returnValue();
    service.start(click as MouseEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#start() should create a polygon', () => {
    service.drawingInProgress = false;
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.start(click as MouseEvent);
    expect(service.drawingInProgress).toBeTruthy();
    expect(service.polygonContainer).toBeDefined();
  });

  it('#searchPosition() should set height and width to 0 when they are 0', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = (click as MouseEvent).offsetX; // 10
    service.posY = (click as MouseEvent).offsetY; // 25
    service.pointStorage.addToStorage(new Point2d(N10, N25));

    service.searchPosition(click as MouseEvent);
    expect(service.height).toBe(N25);
    expect(service.width).toBe(N10);
  });

  it('#searchPosition() should go to zone 1 when height and width are positive', () => {
    const click = { offsetX: 10, offsetY: 25 };
    service.posX0 = 0;
    service.posY0 = 0;
    spyOn(service, 'getZone').and.returnValue(CST.ZONE_1);
    service.searchPosition(click as MouseEvent);
    expect(service.posY).toBe(N10);
  });

  it('#searchPosition() should go to zone 2 when height is pos and width is neg', () => {
    const click = { offsetX: 10, offsetY: -25 };
    service.posX0 = 0;
    service.posY0 = 0;
    spyOn(service, 'getZone').and.returnValue(CST.ZONE_2);
    service.searchPosition(click as MouseEvent);
    expect(service.posY).toBe(-N10);
  });

  it('#searchPosition() should go to zone 3 when height and width are neg', () => {
    const click = { offsetX: -10, offsetY: -25 };
    service.posX0 = 0;
    service.posY0 = 0;
    spyOn(service, 'getZone').and.returnValue(CST.ZONE_3);
    service.searchPosition(click as MouseEvent);
    expect(service.posY).toBe(-N10);
  });

  it('#searchPosition() should go to zone 4 when height is neg and width is pos', () => {
    const click = { offsetX: -10, offsetY: 25 };
    service.posX0 = 0;
    service.posY0 = 0;
    spyOn(service, 'getZone').and.returnValue(CST.ZONE_4);
    service.searchPosition(click as MouseEvent);
    expect(service.posY).toBe(N10);
  });

  it('#updatePosition() should work', () => {
    const fakeRect = service.renderer.createElement('rect', 'svg');
    fakeRect.setAttribute('height', '10');
    fakeRect.setAttribute('width', '10');
    service.border = N10;
    service.polygonContainer = fakeRect as HTMLElement;
    service.polygonLength = 0;
    service.posX0 = 0;
    service.posY0 = 0;
    service.posX = N100;
    service.posY = N100;
    service.updatePosition();
    const expect1 = (service.polygonContainer.getAttribute('points') as string).split(' ').length;
    expect(expect1).toBe(N10);
  });

  it('#searchExtremum() should work', () => {
    service.polygonContainer = service.renderer.createElement('polygon', 'svg');
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N50, N50));
    service.pointStorage.addToStorage(new Point2d(N10, N100));
    service.pointStorage.addToStorage(new Point2d(N100, N10));
    service.searchExtremum();
    const expect1 = service.polygonContainer.getAttribute('minimum') as string;
    const expect2 = service.polygonContainer.getAttribute('maximum') as string;
    expect(expect1).toBe('10:10');
    expect(expect2).toBe('100:100');
  });
});
