import { TestBed } from '@angular/core/testing';

import { TypeToolService } from './type-tool.service';

describe('TypeToolService', () => {
  let service: TypeToolService;
  const INDEX_FAKE = 100;
  const INDEX_RANDOM = 101;
  const FAKE_RACCOURCI_EVENT = { key: 'fake', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;

  beforeEach(() => {
    service = TestBed.get(TypeToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 toggledOptionBrush should activate type of brush', () => {
    service.typeBrush.set(INDEX_FAKE, 'fakeString');
    service.toggledOptionBrush(INDEX_FAKE);
    expect(service.activatedTypeBrush).toBe('fakeString');
    service.toggledOptionBrush(INDEX_RANDOM);
    expect(service.activatedTypeBrush).toBe('fakeString');
  });

  it('#2 toggledOptionPolygon should activate type of brush', () => {
    service.typePolygon.set(INDEX_FAKE, 'fakeString');
    service.typePolygonToActivate.set('fakeString', FAKE_RACCOURCI_EVENT);
    spyOn(service.tool, 'chooseTool').and.returnValue(true);
    service.toggledOptionPolygon(INDEX_FAKE);
    expect(service.activatedTypePolygon).toBe('fakeString');
    service.toggledOptionPolygon(INDEX_RANDOM);
    expect(service.activatedTypePolygon).toBe('fakeString');
  });

  it('#3 toggledOptionBrush should NOT activate type of brush ', () => {
    service.toggledOptionBrush(INDEX_RANDOM);
    expect(service.activatedTypeBrush).toBe('normal');
  });

  it('#4 toggledOptionPolygon should NOT activate type of polygon ', () => {
    service.toggledOptionPolygon(INDEX_RANDOM);
    expect(service.activatedTypePolygon).toBe('rectangle');
  });

  it('#5 toggledOptionColor should NOT activate type of polygon ', () => {
    service.toggledOptionColor(INDEX_RANDOM);
    expect(service.activatedTypeColorTool).toBe('pipette');
  });

  it('#6 toggledOptionColor should activate type of brush', () => {
    service.typeColorTool.set(INDEX_FAKE, 'fakeString');
    service.typeColorToolToActivate.set('fakeString', FAKE_RACCOURCI_EVENT);
    spyOn(service.tool, 'chooseTool').and.returnValue(true);
    service.toggledOptionColor(INDEX_FAKE);
    expect(service.activatedTypeColorTool).toBe('fakeString');
    service.toggledOptionColor(INDEX_RANDOM);
    expect(service.activatedTypeColorTool).toBe('fakeString');
  });

});
