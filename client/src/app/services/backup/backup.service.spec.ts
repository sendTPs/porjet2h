import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PencilService } from '../pencil-tool/pencil.service';
import { BackupService } from './backup.service';

describe('BackupService', () => {
  let pencilService: PencilService; // rajout de pencilService pour creer HTMLElement en utilisant renderer
  const N10 = 10;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    pencilService = TestBed.get(PencilService);

  });

  it('should be created ', () => {
    const service: BackupService = TestBed.get(BackupService);
    localStorage.clear();
    expect(service).toBeTruthy();
  });

  it('should be created and set hasSketch to true if localStrorage is not empty', () => {
    localStorage.setItem('element', 'value');
    const service: BackupService = TestBed.get(BackupService);
    expect(service).toBeTruthy();
    expect(service.hasSketch).toBeTruthy();
  });

  it('#save should call LocalStorage.setItem and define svgElement,height and width if there is a parameter ', () => {
    const service: BackupService = TestBed.get(BackupService);
    const htmlElement = pencilService.renderer.createElement('svg');
    const element = new ElementRef<HTMLElement>(htmlElement);

    const spy = spyOn(localStorage, 'setItem').and.callThrough();

    service.save(element, N10, N10);
    expect(spy).toHaveBeenCalled();

  });

  it('#save should call LocalStorage.setItem', () => {
    const service: BackupService = TestBed.get(BackupService);
    const spy = spyOn(localStorage, 'setItem').and.callThrough();
    const htmlElement = pencilService.renderer.createElement('svg');
    service.svgElement = new ElementRef<HTMLElement>(htmlElement);
    service.save();
    expect(spy).toHaveBeenCalled();
  });

  it('#restoreBackup should call LocalStorage.getItem', () => {
    const service: BackupService = TestBed.get(BackupService);
    const spy = spyOn(localStorage, 'getItem').and.callThrough();
    service.restoreBackup();
    expect(spy).toHaveBeenCalledWith('svg');
  });

});
