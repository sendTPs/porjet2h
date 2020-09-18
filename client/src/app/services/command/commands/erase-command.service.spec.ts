import { SketchService } from '../../sketch/sketch.service';
import { CommandEraseService } from './erase-command.service';

describe('EraseCommandService', () => {
  let service: CommandEraseService;

  beforeEach(() => service = new CommandEraseService({} as SketchService, {} as HTMLElement[], {} as HTMLElement));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 execute should remove element', () => {
    service.elements = new Array<HTMLElement>();
    service.sketch = new SketchService();
    service.SVG = { offsetHeight: 5, offsetLeft: 10, removeChild: (element) => { return; } } as HTMLElement;
    const fakeElem = document.createElement('g');
    const fakeNode = document.createElement('rect');
    fakeElem.appendChild(fakeNode);
    service.elements.push(fakeElem);
    spyOn(service.sketch, 'delete').and.callThrough();

    service.execute();
    expect(service.sketch.delete).toHaveBeenCalled();
  });

  it('#2 remove should append element', () => {
    service.elements = new Array<HTMLElement>();
    service.sketch = new SketchService();
    service.SVG = { offsetHeight: 5, offsetLeft: 10, appendChild: (element) => { return; } } as HTMLElement;
    const fakeElem = document.createElement('g');
    const fakeNode = document.createElement('rect');
    fakeElem.appendChild(fakeNode);
    service.elements.push(fakeElem);
    spyOn(service.sketch, 'add').and.callThrough();

    service.remove();
    expect(service.sketch.add).toHaveBeenCalled();
  });

});
