import { TestBed } from '@angular/core/testing';

import { SketchService } from '@services/sketch/sketch.service';
import { CommandDrawingService } from './drawing-command.service';

describe('CommandDrawingService', () => {
  let service: CommandDrawingService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = new CommandDrawingService({} as SketchService, {} as HTMLElement, {} as HTMLElement));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 execute should append element', () => {
    service.SVG = { accessKey: 'svg', offsetHeight: 5, offsetLeft: 10 } as HTMLElement;
    service.canvas = { offsetHeight: 5, offsetLeft: 10, appendChild: (element) => { return; } } as HTMLElement;
    const fctSpy = spyOn(service.canvas, 'appendChild');
    service.sketch = new SketchService();
    service.execute();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#2 remove should remove element', () => {
    service.SVG = { accessKey: 'svg', offsetHeight: 5, offsetLeft: 10 } as HTMLElement;
    service.canvas = { offsetHeight: 5, offsetLeft: 10, removeChild: (element) => { return; } } as HTMLElement;
    service.sketch = new SketchService();
    const fctSpy = spyOn(service.canvas, 'removeChild');

    service.remove();
    expect(fctSpy).toHaveBeenCalled();
  });

});
