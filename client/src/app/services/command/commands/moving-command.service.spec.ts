import { TestBed } from '@angular/core/testing';

import { CommandMovingService } from './moving-command.service';

describe('CommandMovingService', () => {
  let service: CommandMovingService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = new CommandMovingService({} as HTMLElement[], {} as string[], {} as string[]));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 execute should append element', () => {
    service.selectedElement = new Array<HTMLElement>();
    service.selectedElement.push(
      { accessKey: 'svg', offsetHeight: 5, offsetLeft: 10, setAttribute: (string1, string2) => { return; } } as HTMLElement);
    service.newValue = new Array<string>();
    service.newValue.push('fakeString');
    const fctSpy = spyOn(service.selectedElement[0], 'setAttribute');

    service.execute();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#2 remove should append element', () => {
    service.selectedElement = new Array<HTMLElement>();
    service.selectedElement.push(
      { accessKey: 'svg', offsetHeight: 5, offsetLeft: 10, setAttribute: (string1, string2) => { return; } } as HTMLElement);
    service.oldValue = new Array<string>();
    service.oldValue.push('fakeString');
    const fctSpy = spyOn(service.selectedElement[0], 'setAttribute');

    service.remove();
    expect(fctSpy).toHaveBeenCalled();
  });

});
