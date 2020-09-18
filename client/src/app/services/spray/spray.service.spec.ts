import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Point2d } from '@models/point2d.class';

import { SprayService } from './spray.service';

describe('SprayService', () => {
  let service: SprayService;
  const N50 = 50;

  beforeEach(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        SprayService,
      ]
    });
    service = TestBed.get(SprayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#end should clear the storage', () => {
    service.drawingInProcess = true;
    const fctSpy = spyOn(service.pointStorage, 'clearStorage');
    spyOn(service, 'searchExtremum');

    service.end();
    expect(fctSpy).toHaveBeenCalled();
    expect(service.drawingInProcess).toBeFalsy();

  });

  it('#end should do nothing if drawingInProcess is false', () => {
    service.drawingInProcess = false;
    const fctSpy = spyOn(service.pointStorage, 'clearStorage');

    service.end();
    expect(fctSpy).not.toHaveBeenCalled();
    expect(service.drawingInProcess).toBeFalsy();

  });

  it('#shortcut needs to be called for toolInterface', () => {
    service.shortcut();
  });

  it('#start should defined sprayContainer, eleGroup, some attribute (like fill) and update drawingInProcess to true  ', () => {
    const click = { offsetX: N50, offsetY: N50 };
    service.elementSVG = service.renderer.createElement('svg');

    service.start(click as MouseEvent);
    spyOn(service.sprayContainer, 'setAttribute').and.callThrough();
    expect(service.sprayContainer).toBeDefined();
    expect(service.eleGroup).toBeDefined();
    expect(service.drawingInProcess).toBeTruthy();
    expect(service.sprayContainer.getAttribute('fill')).toBe('none');

  });

  it('#createPoint should call pointStorage.addToStorage() and sprayContainer.setAttibute()', () => {
    const mouseDown: MouseEvent = new MouseEvent('mousedown');
    service.sprayContainer = service.renderer.createElement('path', 'svg');

    const storageSpy = spyOn(service.pointStorage, 'addToStorage');
    spyOn(service.sprayContainer, 'getAttribute');
    const containerSpy = spyOn(service.sprayContainer, 'setAttribute');

    service.createPoint(mouseDown, service, 1);

    expect(storageSpy).toHaveBeenCalled();
    expect(containerSpy).toHaveBeenCalled();

  });

  it('#draw should be called when the mouse move and should call functions if drawingInProcess is true', () => {
    service.drawingInProcess = true;
    service.sprayContainer = service.renderer.createElement('polygon', 'svg');

    const movingMouse = { offsetX: N50, offsetY: N50 };

    service.draw(movingMouse as MouseEvent);
    expect(service.currentPosition).toEqual(new Point2d(N50, N50));
    expect(service.interval).toBeDefined();

  });

  it('#draw should do nothing if drawingInProcess is false', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    service.drawingInProcess = false;

    service.draw(mouse);
    expect(service.currentPosition).not.toBeDefined();

  });
});
