import { TestBed } from '@angular/core/testing';

import { SelectionResizeService } from './selection-resize.service';

describe('SelectionResizeService', () => {
  const N4 = 4;
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionResizeService = TestBed.get(SelectionResizeService);
    expect(service).toBeTruthy();
  });

  it('#resizableXXXX() should console.log#', () => {
    const service: SelectionResizeService = TestBed.get(SelectionResizeService);
    const fctSpy = spyOn(console, 'log');
    service.resizableDown();
    service.resizableUp();
    service.resizableLeft();
    service.resizableRight();
    expect(fctSpy).toHaveBeenCalledTimes(N4);
  });
});
