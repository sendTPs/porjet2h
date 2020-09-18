import { TestBed } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  const offset = 'offset';
  const renderer = 'renderer';
  let service: ClipboardService;
  beforeEach(() => {
    service = TestBed.get(ClipboardService);
    // tslint:disable: no-string-literal
    service.elementSVG = service['renderer'].createElement('svg');
    service.selection.elementActionG = service['renderer'].createElement('svg', 'g');

  });

  it('should be created', () => {
    expect(service).toBeTruthy('');
  });

  it('copy should write selected elements to the navigators clipboard', () => {
    const fakeElem = service[renderer].createElement('polyline', 'svg') as HTMLElement;

    service['selectionElement'].elementSelected.push(service.selection.elementActionG);
    service.selectionElement.elementSelected.push(document.createElement('div'));
    service.selectionElement.elementSelected.push(document.createElement('div'));

    service.elementSVG.appendChild(service.selection.elementActionG);
    spyOn(service.elementSVG, 'removeChild').and.returnValue(fakeElem);
    service.copy();

    spyOn(navigator.clipboard, 'readText').and.callFake(async () => {
      return await new Promise((res, req) => {
        res();
      });
    });
    // tslint:disable: no-magic-numbers
    expect(service['selectionElement'].elementSelected.length).toBe(3);
    // expect(service.elementSVG.removeChild).not.toHaveBeenCalled();
  });

  it('copy shouldnt work when nothing is selected', () => {
    spyOn(navigator.clipboard, 'writeText').and.callFake(async () => {
      return new Promise((res, req) =>
        res());
    });
    service.copy();
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('paste should write selected elements to the navigators clipboard', async () => {
    service['selectionElement'].elementSelected.push(service.selection.elementActionG);
    service.elementSVG.appendChild(service.selection.elementActionG);

    spyOn(service.selection, 'erase').and.callThrough();
    spyOn(service.selection, 'createRectangleAction').and.callFake(() => { return; });
    spyOn(service.selection.logic, 'selectedByRectangle').and.callFake(() => true);
    spyOn(navigator.clipboard, 'readText').and.callFake(async () => {
      return await new Promise((res, req) => {
        res(`<rect _ngcontent-aob-c13="" height="131" width="279" x="148" y="131" stroke-width="8" stroke="rgba(127, 127, 127, 1)"
        fill="rgba(0, 0, 0, 1)" transform="translate(0,0) rotate(0,0,0) scale(1,1)" angle="0" vectorTranslate="0:0" vectorScale="1:1"
        maximum="427:262" minimum="148:131" centerElement="287.5:196.5"></rect>`);
      });
    });
    service.copy();
    await service.paste();

    expect(service['offset']).toBe(0);
    expect(service.selection.erase).toHaveBeenCalled();
  });

  it('duplicate should work', () => {
    spyOn(service.selection.logic, 'selectedByRectangle').and.callFake(() => true);
    // tslint:disable: no-any
    spyOn<any>(service.selection, 'createRectangleAction').and.callFake(() => { return; });
    service.selectionElement.elementSelected.push(service.selection.elementActionG);
    service.selectionElement.elementSelected.push(document.createElement('div'));
    service.elementSVG.appendChild(service.selection.elementActionG);
    service[offset] = 0;

    service.duplicate();
    expect(service[offset]).toBe(0);
    expect(service['selectionElement'].elementSelected.length).toBe(1);
  });

  it('cut should call copy and paste', () => {
    spyOn(service, 'copy').and.callThrough();
    spyOn(service, 'delete').and.callThrough();

    service.cut();
    expect(service.copy).toHaveBeenCalled();
    expect(service.delete).toHaveBeenCalled();
  });

  it('delete should work', () => {
    const fakeElem = service[renderer].createElement('polyline', 'svg') as HTMLElement;
    service['selectionElement'].elementSelected.push(service.selection.elementActionG);
    service.selectionElement.elementSelected.push(document.createElement('div'));
    service.elementSVG.appendChild(service.selection.elementActionG);

    spyOn(service.elementSVG, 'removeChild').and.returnValue(fakeElem);

    service.delete();
    expect(service.elementSVG.removeChild).toHaveBeenCalled();
    expect(service.selectionElement.elementSelected.length).toBe(2);
  });

  it('shiftElement should set offset depending on right position', () => {
    spyOn(service.elementSVG, 'getBoundingClientRect').and.callFake(() => {
      return { right: 0, left: 0 } as DOMRect;
    });
    spyOn(service.selection.elementActionG, 'getBoundingClientRect').and.callFake(() => {
      return { right: 100000, left: 0 } as DOMRect;
    });
    service[offset]++;

    service.shiftElement();
    expect(service[offset]).toBe(0);
  });

  it('shiftElement should set offset depending on bottom position', () => {
    spyOn(service.elementSVG, 'getBoundingClientRect').and.callFake(() => {
      return { bottom: 0, top: 0 } as DOMRect;
    });
    spyOn(service.selection.elementActionG, 'getBoundingClientRect').and.callFake(() => {
      return { bottom: 100000, right: 0 } as DOMRect;
    });
    service[offset]++;

    service.shiftElement();
    expect(service[offset]).toBe(0);
  });

  it('shiftElement should offset elements', () => {
    service[offset] += 1;
    spyOn(service.elementSVG, 'getBoundingClientRect').and.callFake(() => {
      return { right: 100000, left: 0 } as DOMRect;
    });
    spyOn(service.selection.elementActionG, 'getBoundingClientRect').and.callFake(() => {
      return { right: 0, left: 0 } as DOMRect;
    });
    spyOn(service.selection.move, 'mouseMove').and.callFake(() => { return; });

    service.shiftElement();
    expect(service.selection.move.mouseMove).toHaveBeenCalled();
  });

});
