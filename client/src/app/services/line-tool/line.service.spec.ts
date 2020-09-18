import { TestBed } from '@angular/core/testing';

import { Point2d } from '@models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { LineService } from './line.service';

describe('LineService', () => {
  let service: LineService;
  let storageSpy: jasmine.SpyObj<PointStorageService>;
  const ESCAPE_SHORTCUT_EVENT = { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const SHIFT_SHORTCUT_EVENT = { key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true } as KeyboardEvent;
  const BACKSPACE_SHORTCUT_EVENT = { key: 'Backspace', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const ELSE_SHORTCUT_EVENT = { key: 'ttt', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const N10 = 10;
  const N20 = 20;
  const N11 = 11;
  const N100 = 100;
  const N50 = 50;
  const N9 = 9;
  const N5 = 5;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage', 'deleteLastPosition']);
    TestBed.configureTestingModule({
      providers: [
        LineService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(LineService);
    storageSpy = TestBed.get(PointStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 shorcut(..All..) should do nothing', () => {
    service.forceAngleActivated = false;
    service.shortcut(SHIFT_SHORTCUT_EVENT, false);
    expect(service.forceAngleActivated).toBeTruthy();
    service.forceAngleActivated = true;
    service.shortcut(SHIFT_SHORTCUT_EVENT, false);
    expect(service.forceAngleActivated).toBeTruthy();
    service.forceAngleActivated = false;
    service.shortcut(SHIFT_SHORTCUT_EVENT, true);
    expect(service.forceAngleActivated).toBeFalsy();
    const fctSpy1 = spyOn(service, 'deleteLastPosition');
    const fctSpy2 = spyOn(service, 'deleteCurrentLine');
    service.shortcut(BACKSPACE_SHORTCUT_EVENT, true);
    service.shortcut(ESCAPE_SHORTCUT_EVENT, true);
    service.shortcut(ELSE_SHORTCUT_EVENT, false);
    expect(service.forceAngleActivated).toBeFalsy();
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();
  });

  it('#2 shorcut(Shift) should do forceAngle = true (mouseDOWN)', () => {
    service.drawingInProcess = true;
    const fctSpy = spyOn(service, 'updateCurrentPath').and.returnValue();
    service.shortcut(SHIFT_SHORTCUT_EVENT, false);
    expect(service.forceAngleActivated).toBeTruthy();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#3 shorcut(Shift) should do forceAngle = false (mouseUP)', () => {
    service.forceAngleActivated = true;
    service.shortcut(SHIFT_SHORTCUT_EVENT, true);
    expect(service.forceAngleActivated).toBeFalsy();
  });

  it('#4 shorcut(Backspace) should call deleteLastPosition (mouseDOWN)', () => {
    const fctSpy = spyOn(service, 'deleteLastPosition').and.returnValue();
    service.shortcut(BACKSPACE_SHORTCUT_EVENT, false);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#5 shorcut(Escape) should call deleteLastPosition (mouseDOWN)', () => {
    const fctSpy = spyOn(service, 'deleteCurrentLine').and.returnValue();
    service.shortcut(ESCAPE_SHORTCUT_EVENT, false);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#6 end() should do nothing if drawingInProcess is FALSE', () => {
    spyOn(service, 'searchExtremum').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(storageSpy.clearStorage).not.toHaveBeenCalled();
  });

  it('#7 end() should call clearStorage if drawingInProcess is TRUE', () => {
    spyOn(service, 'searchExtremum').and.returnValue();
    service.elementG = service.renderer.createElement('rect', 'svg');
    service.drawingInProcess = true;
    spyOn(service, 'setLastPoint').and.returnValue();
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(storageSpy.clearStorage).toHaveBeenCalled();
  });

  it('#8 start should create a line', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    spyOn(service, 'addDataToLine').and.returnValue(click.offsetX + ',' + click.offsetY);
    service.start(click as MouseEvent);
    expect(service.drawingInProcess).toBeTruthy();
    expect(service.lineContainer).toBeDefined();
  });

  it('#9 start() should call a drawNewLine if drawingInProcess is true', () => {
    service.elementSVG = service.renderer.createElement('svg');
    const click = { offsetX: 50, offsetY: 50 };
    service.drawingInProcess = true;
    const fctSpy = spyOn(service, 'drawNewLine').and.returnValue();
    service.start(click as MouseEvent);
    expect(service.drawingInProcess).toBeTruthy();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#10 draw() should do nothing when drawProcess is false', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    spyOn(service, 'updateCurrentPath').and.callThrough();
    service.drawingInProcess = false;
    service.draw(mouse);
    expect(storageSpy.addToStorage).not.toHaveBeenCalled();
    expect(service.updateCurrentPath).not.toHaveBeenCalled();
  });

  it('#11 draw should call fcts when drawProcess is true', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.drawingInProcess = true;
    spyOn(service, 'searchPosition').and.callFake(() => { return; });
    spyOn(service, 'updateCurrentPath').and.callFake(() => { return; });
    service.draw(click as MouseEvent);
    expect(service.searchPosition).toHaveBeenCalled();
    expect(service.updateCurrentPath).toHaveBeenCalled();
  });

  it('#12 drawNewLine should do nothing when drawProcess is false', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    spyOn(service, 'updateCurrentPath').and.callThrough();
    service.drawingInProcess = false;
    service.drawNewLine(mouse);
    expect(storageSpy.addToStorage).not.toHaveBeenCalled();
    expect(service.updateCurrentPath).not.toHaveBeenCalled();
  });

  it('#13 drawNewLine should call fcts when drawProcess is true', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.drawingInProcess = true;
    spyOn(service, 'searchPosition').and.callFake(() => { return; });
    spyOn(service, 'updateNewPath').and.callFake(() => { return; });
    service.drawNewLine(click as MouseEvent);
    expect(service.searchPosition).toHaveBeenCalled();
    expect(service.updateNewPath).toHaveBeenCalled();
  });

  it('#14 searchPosition should addToStorage', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.searchPosition(click as MouseEvent, false);
    expect(storageSpy.addToStorage).toHaveBeenCalled();
  });

  it('#15 searchPosition should deleteLastPosition then addToStorage', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N20));
    const click = { offsetX: 10, offsetY: 20 };
    service.searchPosition(click as MouseEvent, true);
    expect(service.pointStorage.storage.length).toBe(1);
  });

  it('#16 setLastPoint should merge the start and the end', () => {
    const fakePath = service.renderer.createElement('polyline');
    service.attributeD = 'X';
    service.lineContainer = fakePath as HTMLElement;
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N20));
    service.pointStorage.addToStorage(new Point2d(N11, N20));
    const zoneSpy = spyOn(service, 'deleteLastPosition').and.returnValue();
    storageSpy.deleteLastPosition.and.returnValue();
    service.setLastPoint();
    expect(zoneSpy).toHaveBeenCalled();
  });

  it('#17 setLastPoint should do nothing', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N20));
    service.pointStorage.addToStorage(new Point2d(N20, N20));
    const zoneSpy = spyOn(service, 'deleteLastPosition').and.callFake(() => { return; });
    service.setLastPoint();
    expect(zoneSpy).not.toHaveBeenCalled();
  });

  it('#18 addDataToLine should should return correct point', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N20));
    expect(service.addDataToLine()).toEqual('10,20');
  });

  it('#19 addDataToLine should return correct point (ForceAngle)', () => {
    service.forceAngleActivated = true;
    const zoneSpy = spyOn(service, 'getZone');
    zoneSpy.and.callFake(() => '1');
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N20, N9));
    expect(service.addDataToLine()).toEqual('20,10');
    zoneSpy.and.callFake(() => '2');
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N20, 1));
    expect(service.addDataToLine()).toEqual('20,0');
    zoneSpy.and.callFake(() => '3');
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N9, 0));
    expect(service.addDataToLine()).toEqual('10,0');
    zoneSpy.and.callFake(() => '4');
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(0, 1));
    expect(service.addDataToLine()).toEqual('0,0');
    zoneSpy.and.callFake(() => '5');
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(0, N5));
    expect(service.addDataToLine()).toEqual('0,5');
  });

  it('#20 getZone should return the good zone depending the coords', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N20, N9));
    let fakeStorage = service.pointStorage.storage;
    let zone = service.getZone(fakeStorage);
    expect(zone).toBe('1'); // Zone 1
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N20, 1));
    fakeStorage = service.pointStorage.getStorage();
    zone = service.getZone(fakeStorage);
    expect(zone).toBe('2'); // Zone 2
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N11, 0));
    fakeStorage = service.pointStorage.getStorage();
    zone = service.getZone(fakeStorage);
    expect(zone).toBe('3'); // Zone 4
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N9, 0));
    fakeStorage = service.pointStorage.getStorage();
    zone = service.getZone(fakeStorage);
    expect(zone).toBe('3'); // Zone 5
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(1, 0));
    fakeStorage = service.pointStorage.getStorage();
    zone = service.getZone(fakeStorage);
    expect(zone).toBe('4'); // Zone 6
    service.pointStorage.addToStorage(new Point2d(N10, N10));
    service.pointStorage.addToStorage(new Point2d(N20, N11));
    fakeStorage = service.pointStorage.getStorage();
    zone = service.getZone(fakeStorage);
    expect(zone).toBe('1'); // Zone 16
  });

  it('#21 updateCurrentPath should set element properly', () => {
    const fakePath = service.renderer.createElement('polyline');
    service.attributeD = '0,0';
    fakePath.setAttribute('points', '0,0 10,10');
    service.lineContainer = fakePath as HTMLElement;
    service.linesLength = 0;
    spyOn(service, 'addDataToLine').and.callFake(() => '50,50');
    service.updateCurrentPath();
    expect(service.lineContainer.getAttribute('points')).toBe('0,0 50,50');
  });

  it('#22 updateNewPath should set element properly', () => {
    const fakePath = service.renderer.createElement('polyline');
    fakePath.setAttribute('points', '0,0 10,10');
    service.lineContainer = fakePath as HTMLElement;
    service.linesLength = 0;
    spyOn(service, 'addDataToLine').and.callFake(() => '50,50');
    service.updateNewPath();
    expect(service.lineContainer.getAttribute('points')).toBe('0,0 10,10 50,50');
    expect(service.attributeD).toBe('0,0 10,10');
  });

  it('#23 deleteLastPosition should set attributeD properly', () => {
    const fakePath = service.renderer.createElement('polyline');
    fakePath.setAttribute('points', '0,0 10,10 12,12 14,14');
    service.lineContainer = fakePath as HTMLElement;
    service.linesLength = 0;
    spyOn(service, 'updateCurrentPath').and.returnValue();
    spyOn(service, 'deleteLastJonction').and.returnValue();
    service.deleteLastPosition();
    expect(service.attributeD).toBe('0,0 10,10');
  });

  it('#24 deleteCurrentLine should do nothing (drawInProcess = F )', () => {
    const fakeSVG = service.renderer.createElement('svg');
    service.drawingInProcess = false;
    const fctSpy = spyOn(service, 'end');
    service.deleteCurrentLine(fakeSVG);
    expect(fctSpy).not.toHaveBeenCalled();
  });

  it('#25 deleteCurrentLine should delete the line', () => {
    const fakePath = service.renderer.createElement('polyline');
    service.lineContainer = fakePath as HTMLElement;
    service.linesLength = 0;
    const fakeCircle = service.renderer.createElement('circle');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    const fakeSVG = service.renderer.createElement('svg');
    service.drawingInProcess = true;
    const fctSpy = spyOn(service, 'end');
    service.deleteCurrentLine(fakeSVG);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#26 makePointJonction should remove the jonctions', () => {
    service.elementG = service.renderer.createElement('svg');
    service.linesLength = 0;
    service.attribute.activateJonction = true;
    service.attribute.widthJonction = '10';
    const fakeCircle = service.renderer.createElement('circle');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    // spyOn(service.jonctionWidth, 'getActivation').and.returnValue(true);
    // spyOn(service.jonctionWidth, 'getWidth').and.returnValue('10');
    spyOn(service, 'addDataToLine').and.returnValue('0,0');
    service.makePointJonction();
    const expectation = service.jonctionContainer.length;
    expect(expectation).toBe(2);
  });

  it('#27 makePointJonction should do nothing', () => {
    service.linesLength = 0;
    const fakeCircle = service.renderer.createElement('circle');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    service.makePointJonction();
    const expectation = service.jonctionContainer.length;
    expect(expectation).toBe(1);
  });

  it('#28 deleteLastJonction remove the last jonction', () => {
    service.linesLength = 0;
    const fakeCircle = service.renderer.createElement('circle');
    service.attribute.activateJonction = true;
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    // spyOn(service.jonctionWidth, 'getActivation').and.returnValue(true);
    service.deleteLastJonction();
    const expectation = service.jonctionContainer.length;
    expect(expectation).toBe(0);
  });

  it('#29 deleteLastJonction should do nothing', () => {
    service.linesLength = 0;
    service.attribute.activateJonction = false;
    const fakeCircle = service.renderer.createElement('circle');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    // spyOn(service.jonctionWidth, 'getActivation').and.returnValue(false);
    service.deleteLastJonction();
    const expectation = service.jonctionContainer.length;
    expect(expectation).toBe(1);
  });

  it('#30 updateCurrentJonction should do nothing', () => {
    service.linesLength = 0;
    service.attribute.activateJonction = false;
    const fakeCircle = service.renderer.createElement('circle');
    fakeCircle.setAttribute('cx', '0');
    fakeCircle.setAttribute('cy', '0');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    // spyOn(service.jonctionWidth, 'getActivation').and.returnValue(false);
    spyOn(service, 'addDataToLine').and.returnValue('50,50');
    service.updateCurrentJonction();
    expect(service.jonctionContainer[0].getAttribute('cx')).toBe('0');
    expect(service.jonctionContainer[0].getAttribute('cy')).toBe('0');
  });

  it('#31 updateCurrentJonction should do nothing', () => {
    service.linesLength = 0;
    service.attribute.activateJonction = true;
    const fakeCircle = service.renderer.createElement('circle');
    fakeCircle.setAttribute('cx', '0');
    fakeCircle.setAttribute('cy', '0');
    service.jonctionContainer.push(fakeCircle as HTMLElement);
    // spyOn(service.jonctionWidth, 'getActivation').and.returnValue(true);
    spyOn(service, 'addDataToLine').and.returnValue('50,50');
    service.updateCurrentJonction();
    expect(service.jonctionContainer[0].getAttribute('cx')).toBe('50');
    expect(service.jonctionContainer[0].getAttribute('cy')).toBe('50');
  });

  it('#32 searchExtremum() should work', () => {
    service.lineContainer = service.renderer.createElement('polygon', 'svg');
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N50, N50));
    service.pointStorage.addToStorage(new Point2d(N10, N100));
    service.pointStorage.addToStorage(new Point2d(N100, N10));
    service.searchExtremum();
    const expect1 = service.lineContainer.getAttribute('minimum') as string;
    const expect2 = service.lineContainer.getAttribute('maximum') as string;
    expect(expect1).toBe('10:10');
    expect(expect2).toBe('100:100');
  });
  // tslint:disable: max-file-line-count
});
