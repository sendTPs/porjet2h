import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';

import { HandToolService } from './hand-tool.service';

describe('HandToolService', () => {
  let service: HandToolService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(HandToolService));

  it('should be created', () => {
    service.start({ x: 0, y: 0 } as MouseEvent);
    service.draw({ x: 0, y: 0 } as MouseEvent);
    service.end();
    expect(service).toBeTruthy();
  });

  it('#1 keyborad (-) should call downWidthGrille', () => {
    const fctSpy1 = spyOn(service.attribute, 'downWidthGrille');
    service.shortcut(CST.MINUS_SHORTCUT_EVENT, false);
    expect(fctSpy1).toHaveBeenCalled();
  });

  it('#2 keyborad (+) should call upWidthGrille', () => {
    const fctSpy = spyOn(service.attribute, 'upWidthGrille');
    service.shortcut(CST.PLUS_SHORTCUT_EVENT, false);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#3 keyborad (c) should NOT call downWidthGrille or upWidthGrille', () => {
    const fctSpy1 = spyOn(service.attribute, 'downWidthGrille');
    const fctSpy2 = spyOn(service.attribute, 'upWidthGrille');
    service.shortcut(CST.PENCIL_SHORTCUT_EVENT, false);
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();
  });
});
