import { TestBed } from '@angular/core/testing';

import { Point2d } from '@models/point2d.class';

import { PointStorageService } from './point-storage.service';

const point: Point2d = new Point2d(0, 0);

describe('PointStorageService', () => {
  let service: PointStorageService;
  beforeEach(() => {
    service = TestBed.get(PointStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 getStorage should return Array', () => {
    const expectedValue = new Array<Point2d>();
    expect(service.getStorage()).toEqual(expectedValue);
  });

  it('#2 addToStorage should increase index', () => {
    service.addToStorage(point);
    expect(service.index).toBe(1);
  });

  it('#3 addToStorage should add (0,0)', () => {
    service.addToStorage(point);
    expect(service.storage[0]).toBe(point);
  });

  it('#4 getIndex should return Index', () => {
    expect(service.getIndex()).toBe(0);
  });

  it('#5 deleteLastPosition should remove point', () => {
    service.deleteLastPosition();
    expect(service.storage.length).toBe(0);
  });

  it('#6 deleteLastPosition should decrease index', () => {
    service.addToStorage(point);
    expect(service.index).toBe(1);
    service.deleteLastPosition();
    expect(service.index).toBe(0);
  });

  it('#7 deleteLastPosition should NOT decrease index', () => {
    service.deleteLastPosition();
    expect(service.index).toBe(0);
  });

  it('#8 clearStorage should set index to 0', () => {
    service.clearStorage();
    expect(service.index).toBe(0);
  });

});
