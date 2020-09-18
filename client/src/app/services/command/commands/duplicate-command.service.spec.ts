import { SketchService } from '../../sketch/sketch.service';
import { CommandDuplicateService } from './duplicate-command.service';

describe('DuplicateCommandService', () => {
  let service: CommandDuplicateService;

  beforeEach(() => service = new CommandDuplicateService({} as SketchService, {} as HTMLElement[], {} as HTMLElement));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 execute should append element', () => {
    service.elements = new Array<HTMLElement>();
    service.sketch = new SketchService();
    service.SVG = { offsetHeight: 5, offsetLeft: 10, appendChild: (element) => { return; } } as HTMLElement;
    const fakeElem = document.createElement('g');
    const fakeNode = document.createElement('rect');
    fakeElem.appendChild(fakeNode);
    service.elements.push(fakeElem);
    spyOn(service.sketch, 'add').and.callThrough();

    service.execute();
    expect(service.sketch.add).toHaveBeenCalled();
  });

  it('#2 remove should remove element from canvas', () => {
    service.elements = new Array<HTMLElement>();
    service.sketch = new SketchService();
    service.SVG = { offsetHeight: 5, offsetLeft: 10, removeChild: (element) => { return; } } as HTMLElement;
    const fakeElem = document.createElement('g');
    const fakeNode = document.createElement('rect');
    fakeElem.appendChild(fakeNode);
    service.elements.push(fakeElem);
    spyOn(service.sketch, 'delete').and.callThrough();

    service.remove();
    expect(service.sketch.delete).toHaveBeenCalled();
  });

});
