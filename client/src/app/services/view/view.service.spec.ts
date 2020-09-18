import { TestBed } from '@angular/core/testing';

import { ViewService } from './view.service';

describe('ViewService', () => {
  let service: ViewService;

  beforeEach(() => {
    service = TestBed.get(ViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#hideColor should emit change', () => {
    spyOn(service.change, 'emit');
    service.hideColor();

    expect(service.hideNow).toBeTruthy();
    expect(service.change.emit).toHaveBeenCalled();
  });

});
