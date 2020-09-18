import { TestBed } from '@angular/core/testing';

import { Point2d } from '@app/models/point2d.class';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { PencilService } from './pencil.service';

describe('PencilService', () => {
  let service: PencilService;
  let storageSpy: jasmine.SpyObj<PointStorageService>;
  const N100 = 100;
  const N50 = 50;
  const N10 = 10;
  const N20 = 20;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage']);
    TestBed.configureTestingModule({
      providers: [
        PencilService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(PencilService);
    storageSpy = TestBed.get(PointStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 shortcut needs to be called for toolInterface', () => {
    service.shortcut();
  });

  it('#2 end should clear storage', () => {
    spyOn(service, 'searchExtremum').and.returnValue();
    service.drawingInProcess = true;
    service.end();
    expect(service.drawingInProcess).toBeFalsy();
    expect(storageSpy.clearStorage).toHaveBeenCalled();
  });

  it('#3 end should clear storage', () => {
    service.drawingInProcess = false;
    spyOn(service, 'searchExtremum').and.callThrough();
    service.end();
    expect(service.searchExtremum).not.toHaveBeenCalled();
    expect(storageSpy.clearStorage).not.toHaveBeenCalled();
  });

  it('#4 draw should do nothing when drawProcess is false', () => {
    const mouse: MouseEvent = new MouseEvent('mousedown');
    spyOn(service, 'updateCurrentPath').and.callThrough();
    service.drawingInProcess = false;
    service.draw(mouse);
    expect(storageSpy.addToStorage).not.toHaveBeenCalled();
    expect(service.updateCurrentPath).not.toHaveBeenCalled();
  });

  it('#5 draw should call fcts when drawProcess is true', () => {
    const click = { offsetX: 10, offsetY: 20 };
    const svg = { accessKey: 'svg', offsetHeight: 5, offsetLeft: 10 };
    service.drawingInProcess = true;
    spyOn(service, 'searchPosition').and.callFake(() => { return; });
    spyOn(service, 'updateCurrentPath').and.callFake(() => svg as HTMLElement);

    service.draw(click as MouseEvent);
    expect(service.searchPosition).toHaveBeenCalled();
    expect(service.updateCurrentPath).toHaveBeenCalled();
  });

  it('#6 addDataToPath should return correct point', () => {
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N10, N20));

    expect(service.addDataToPath()).toEqual('10,20');
  });

  it('#7 searchPosition should addToStorage', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.searchPosition(click as MouseEvent);
    expect(storageSpy.addToStorage).toHaveBeenCalled();
  });

  it('#8 updateCurrentPath should set element properly and return it', () => {
    const fakePath = service.renderer.createElement('path');
    fakePath.setAttribute('points', '0,0');
    service.pencilContainer = fakePath as HTMLElement;
    service.pencilLength = 0;

    spyOn(service, 'addDataToPath').and.callFake(() => '50,50');
    service.updateCurrentPath();

    expect(service.pencilContainer.getAttribute('points')).toBe('0,0 50,50');
  });

  it('#9 start should work', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.elementSVG = service.renderer.createElement('svg');
    spyOn(service, 'addDataToPath').and.returnValue(click.offsetX + ',' + click.offsetY);

    service.start(click as MouseEvent);
    expect(service.drawingInProcess).toBeTruthy();
    expect(service.pencilLength).toBe(1);
  });

  it('#10 start should work for brush', () => {
    const click = { offsetX: 10, offsetY: 20 };
    service.elementSVG = service.renderer.createElement('svg');
    spyOn(service, 'addDataToPath').and.returnValue(click.offsetX + ',' + click.offsetY);
    service.typeBrush.activatedTypeBrush = 'brush';

    service.start(click as MouseEvent);
    expect(service.pencilContainer.getAttribute('filter')).toBe('url(#brush)');
    expect(service.drawingInProcess).toBeTruthy();
    expect(service.pencilLength).toBe(1);
  });

  it('#11 searchExtremum() should work', () => {
    service.pencilContainer = service.renderer.createElement('polygon', 'svg');
    service.pointStorage = new PointStorageService();
    service.pointStorage.addToStorage(new Point2d(N50, N50));
    service.pointStorage.addToStorage(new Point2d(N10, N100));
    service.pointStorage.addToStorage(new Point2d(N100, N10));
    service.searchExtremum();
    const expect1 = service.pencilContainer.getAttribute('minimum') as string;
    const expect2 = service.pencilContainer.getAttribute('maximum') as string;
    expect(expect1).toBe('10:10');
    expect(expect2).toBe('100:100');
  });

});
