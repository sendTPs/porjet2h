import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SelectionLogicService } from './selection-logic.service';

describe('SelectionLogicService', () => {
  let service: SelectionLogicService;
  // let storageSpy: jasmine.SpyObj<PointStorageService>;

  const N100 = 100;
  const N20 = 20;
  const N10 = 10;
  const N4 = 4;
  const N3 = 3;
  const N2 = 2;
  const N1 = 1;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage', 'deleteLastPosition']);
    TestBed.configureTestingModule({
      providers: [
        SelectionLogicService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(SelectionLogicService);
    // storageSpy = TestBed.get(PointStorageService);
  });

  it('#15 getZone() should do return the good zone#', () => {
    const zone1 = service.getZone(N20, N20);
    const zone2 = service.getZone(N20, -N4);
    const zone3 = service.getZone(-N4, -N4);
    const zone4 = service.getZone(-N4, N20);
    expect(zone1).toBe(CST.ZONE_1);
    expect(zone2).toBe(CST.ZONE_2);
    expect(zone3).toBe(CST.ZONE_3);
    expect(zone4).toBe(CST.ZONE_4);
  });

  it('#16 rectangleBorder() should do return the good zone#', () => {
    const position: { pointA: Point2d, pointB: Point2d; } = {
      pointA: new Point2d(N1, N2),
      pointB: new Point2d(N3, N4)
    };
    service.rectangleBorder(position);
    expect(service.init.x).toBe(N1);
    expect(service.init.y).toBe(N2);
    expect(service.final.x).toBe(N3);
    expect(service.final.y).toBe(N4);
    expect(service.center).toEqual(new Point2d(N2, N3));
  });

  it('#17 removeElement() should do nothing#', () => {
    const ele = document.createElement('rect');
    const fctSpy = spyOn(service.elementSelected, 'splice');
    service.removeElement(ele);
    expect(fctSpy).not.toHaveBeenCalled();
  });

  it('#18 removeElement() should deselect#', () => {
    const ele = document.createElement('rect');
    service.elementSelected.push(ele);
    const fctSpy = spyOn(service.elementSelected, 'splice');
    service.removeElement(ele);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#23 hasAlreadyBeenSelected() should true when the element is selected #', () => {
    const ele1 = document.createElement('rect');
    const ele2 = document.createElement('rect');
    service.elementSelected.push(ele2);
    const expect1 = service.hasAlreadyBeenSelected(ele1);
    const expect2 = service.hasAlreadyBeenSelected(ele2);
    expect(expect1).toBeFalsy();
    expect(expect2).toBeTruthy();
  });

  it('#25 updatePositionElement() should change coords #', () => {
    // service.selectionContainer = document.createElement('rect');
    const position = { pointA: new Point2d(N100, N100), pointB: new Point2d() };
    const data = { min: [N10, N10], max: [N20, N20] };
    const expect1 = service.updatePositionElement(position, data);
    expect(expect1).toEqual({ pointA: new Point2d(N10, N10), pointB: new Point2d(N20, N20) });
  });

  it('#26 updatePositionElement() should NOT change coords #', () => {
    // service.selectionContainer = service.renderer.createElement('rect', 'svg');
    const position = { pointB: new Point2d(N100, N100), pointA: new Point2d() };
    const data = { min: [N10, N10], max: [N20, N20] };
    const expect1 = service.updatePositionElement(position, data);
    expect(expect1).toEqual({ pointA: new Point2d(), pointB: new Point2d(N100, N100) });
  });

  // it('#27 setDataElement() should work#', () => {
  //   const element = document.createElement('rect');
  //   element.setAttribute('minimum', '0:0');
  //   element.setAttribute('maximum', '16:10');
  //   element.setAttribute('centerElement', '8:5');
  //   element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
  //   const expect1 = service.setDataElement(element);
  //   expect(expect1).toEqual({ min: [N4, N10], max: [N20, N20] });
  // });

  // it('#28 setDataElement() should work#', () => {
  //   const element = document.createElement('rect');
  //   element.setAttribute('minimum', '0:0');
  //   element.setAttribute('maximum', '16:10');
  //   element.setAttribute('centerElement', '8:5');
  //   element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
  //   const expect1 = service.setDataElement(element);
  //   expect(expect1).toEqual({ min: [N4, N10], max: [N20, N20] });
  // });

  it('#29 selectedByClick() should work (click + not move + M1/M2) 1#', () => {
    // tslint:disable: no-magic-numbers
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.elementTargeted = element;
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.sketch.add(element);
    const expect1 = service.selectedByClick();
    expect(expect1).toBe(true);
    service.clearSelectedElement();
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByClick();
    expect(expect2).toBe(true);
  });

  it('#30 selectedByClick() should work (click + move + M1/M2) 2#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.elementTargeted = element;
    service.elementSelected.push(element);
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.sketch.add(element);
    const expect1 = service.selectedByClick();
    expect(expect1).toBe(true);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByClick();
    expect(expect2).toBe(false);
  });

  it('#31 selectedByClick() should work (not click + not move + M1/M2) 3#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.sketch.add(element);
    const expect1 = service.selectedByClick();
    expect(expect1).toBe(false);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByClick();
    expect(expect2).toBe(false);
  });

  it('#32 selectedByClick() should work (not click + move + M1/M2) 4#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.elementSelected.push(element);
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.sketch.add(element);
    const expect1 = service.selectedByClick();
    expect(expect1).toBe(true);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByClick();
    expect(expect2).toBe(true);
  });

  it('#33 selectedByRectangle() should work (click + not move + M1/M2) 1#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [4, 10], max: [20, 20] });
    const element = document.createElement('rect');
    element.setAttribute('angle', '0');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '7:4');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.initSelect = new Point2d();
    service.finalSelect = new Point2d();
    service.initSelect.x = N1;
    service.initSelect.y = N1;
    service.finalSelect.x = N100;
    service.finalSelect.y = N100;
    service.sketch.add(element);
    const expect1 = service.selectedByRectangle();
    expect(expect1).toBe(true);
    service.clearSelectedElement();
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByRectangle();
    expect(expect2).toBe(true);
  });

  it('#34 selectedByRectangle() should work (click + move + M1/M2) 2#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [4, 10], max: [20, 20] });
    const element = document.createElement('rect');
    element.setAttribute('angle', '0');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.elementSelected.push(element);
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.initSelect = new Point2d();
    service.finalSelect = new Point2d();
    service.initSelect.x = N1;
    service.initSelect.y = N1;
    service.finalSelect.x = N100;
    service.finalSelect.y = N100;
    service.sketch.add(element);
    const expect1 = service.selectedByRectangle();
    expect(expect1).toBe(true);
    service.elementSelected.push(element);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByRectangle();
    expect(expect2).toBe(false);
  });

  it('#35 selectedByRectangle() should work (not click + not move + M1/M2) 3#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.initSelect = new Point2d();
    service.finalSelect = new Point2d();
    service.initSelect.x = N100;
    service.initSelect.y = N100;
    service.finalSelect.x = N1;
    service.finalSelect.y = N1;
    service.sketch.add(element);
    const expect1 = service.selectedByRectangle();
    expect(expect1).toBe(false);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByRectangle();
    expect(expect2).toBe(false);
  });

  it('#36 selectedByRectangle() should work (not click + move + M1/M2) 4#', () => {
    spyOn(service, 'setDataElement').and.returnValue({ min: [0, 0], max: [16, 10] });
    // service.elementSVG = service.renderer.createElement('svg');
    const element = document.createElement('rect');
    element.setAttribute('minimum', '0:0');
    element.setAttribute('maximum', '16:10');
    element.setAttribute('centerElement', '8:5');
    element.setAttribute('transform', 'translate(4,10) rotate(0,0,0)');
    service.elementSelected.push(element);
    service.eventMemory = { buttons: CST.MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.initSelect = new Point2d();
    service.finalSelect = new Point2d();
    service.initSelect.x = N100;
    service.initSelect.y = N100;
    service.finalSelect.x = N1;
    service.finalSelect.y = N1;
    service.sketch.add(element);
    const expect1 = service.selectedByRectangle();
    expect(expect1).toBe(true);
    service.eventMemory = { buttons: CST.MOUSE_SECONDARY_BUTTON } as MouseEvent;
    const expect2 = service.selectedByRectangle();
    expect(expect2).toBe(true);
  });

  it('#37 isEquivalent() should return (false when is not equal) 4#', () => {
    const RANDOM2 = { key: 'random', ctrlKey: true, altKey: false, shiftKey: false } as KeyboardEvent;
    const RANDOM1 = { key: 'random', altKey: false, shiftKey: false } as KeyboardEvent;
    const expect1 = service.isEquivalent(RANDOM1, RANDOM2);
    expect(expect1).toBe(false);
  });
});
