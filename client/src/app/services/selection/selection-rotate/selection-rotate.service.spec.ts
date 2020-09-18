import { TestBed } from '@angular/core/testing';

import { SelectionRotateService } from './selection-rotate.service';

describe('SelectionRotateService', () => {
  let service: SelectionRotateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionRotateService]
    });
    service = TestBed.get(SelectionRotateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 getCenterCoordonnates() return the center of the form', () => {
    const element = {
      getBoundingClientRect: () => {
        return { left: 10, right: 20, top: 15, bottom: 25 } as DOMRect;
      }
    } as HTMLElement;
    service.logic.elementSVG = {
      getBoundingClientRect: () => {
        return { left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;
      }
    } as HTMLElement;

    // tslint:disable: no-string-literal
    expect(service['getCenterCoordonnates'](element)).toBe('15:20');
  });

  it('#2 wheelUse() turn the form by 15deg', () => {
    const element = document.createElement('rect');
    // tslint:disable: no-any
    spyOn<any>(service, 'getCenterCoordonnates').and.returnValue('10:10');
    service.logic.elementSelected.push(element);
    service.logic.elementSVG = {
      getBoundingClientRect: () => {
        return { left: 0, right: 20, top: 0, bottom: 20 } as DOMRect;
      }
    } as HTMLElement;
    const event = { deltaY: 1, preventDefault: () => { return; } } as WheelEvent;
    service.wheelUse(event);
    expect(element.getAttribute('transform')).toBe('rotate(15,10,10) translate(0,0) rotate(0,0,0)');
  });

  it('#3 wheelUse() turn the form by -15deg', () => {
    const element = document.createElement('rect');
    spyOn<any>(service, 'getCenterCoordonnates').and.returnValue('10:10');
    service.logic.elementSelected.push(element);
    service.logic.elementSVG = {
      getBoundingClientRect: () => {
        return { left: 0, right: 20, top: 0, bottom: 20 } as DOMRect;
      }
    } as HTMLElement;
    const event = { deltaY: -1, preventDefault: () => { return; } } as WheelEvent;
    service.wheelUse(event);
    expect(element.getAttribute('transform')).toBe('rotate(-15,10,10) translate(0,0) rotate(0,0,0)');
  });

  it('#5 wheelUse() turn the form by -1deg if alt is Pressed', () => {
    service.altPressed = true;
    spyOn<any>(service, 'getCenterCoordonnates').and.returnValue('10:10');
    const element = document.createElement('rect');
    element.setAttribute('centerElement', '10:10');
    element.setAttribute('angle', '0');
    element.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
    service.logic.elementSelected.push(element);
    service.logic.elementSVG = {
      getBoundingClientRect: () => {
        return { left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;
      }
    } as HTMLElement;
    const event = { deltaY: -1, preventDefault: () => { return; } } as WheelEvent;
    service.wheelUse(event);
    expect(element.getAttribute('transform')).toBe('rotate(-1,10,10) translate(0,0) rotate(0,0,0)');
  });

  it('#6 wheelUse() turn the form by around itself if shift is Pressed', () => {
    service.altPressed = true;
    service.shiftPressed = true;
    spyOn<any>(service, 'getCenterCoordonnates').and.returnValue('0:0');
    const element = document.createElement('rect');
    element.setAttribute('centerElement', '10:10');
    element.setAttribute('angle', '0');
    element.setAttribute('transform', 'rotate(0,0,0) translate(0,0)');
    service.logic.elementSelected.push(element);
    service.logic.elementSVG = {
      getBoundingClientRect: () => {
        return { left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;
      }
    } as HTMLElement;
    const event = { deltaY: 1, preventDefault: () => { return; } } as WheelEvent;
    service.wheelUse(event);
    expect(element.getAttribute('transform')).toBe('rotate(1,0,0) translate(0,0)');
  });

  it('#7 shortcutALT() turn assigned altPressed to TRUE when alt is pressed', () => {
    const event = { key: 'Alt', ctrlKey: false, altKey: true, shiftKey: false } as KeyboardEvent;
    service.shortcutALT(event, false);
    expect(service.altPressed).toBe(true);
  });

  it('#8 shortcutALT() should turn assigned altPressed to FALSE when alt is released', () => {
    service.altPressed = true;
    const event = { key: 'Alt', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
    service.shortcutALT(event, true);
    expect(service.altPressed).toBe(false);
  });

  it('#9 shortcutALT() should do nothing when a random key is pressed and released', () => {
    service.altPressed = true;
    const event = { key: 'fake', ctrlKey: false, altKey: true, shiftKey: false } as KeyboardEvent;
    service.shortcutALT(event, false);
    expect(service.altPressed).toBe(true);
  });

  it('#10 shortcutSHIFT() turn assigned shiftPressed to TRUE when shift is pressed', () => {
    const event = { key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true } as KeyboardEvent;
    service.shortcutSHIFT(event, false);
    expect(service.shiftPressed).toBe(true);
  });

  it('#11 shortcutSHIFT() should turn assigned shiftPressed to FALSE when shift is released', () => {
    service.shiftPressed = true;
    const event = { key: 'Shift', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
    service.shortcutSHIFT(event, true);
    expect(service.shiftPressed).toBe(false);
  });

  it('#12 shortcutSHIFT() should do nothing when a random key is pressed and released', () => {
    service.shiftPressed = true;
    const event = { key: 'fake', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
    service.shortcutSHIFT(event, false);
    expect(service.shiftPressed).toBe(true);
  });
});
