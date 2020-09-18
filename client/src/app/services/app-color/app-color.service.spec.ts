import { TestBed } from '@angular/core/testing';

import { MOUSE_PRIMARY_BUTTON, MOUSE_SECONDARY_BUTTON } from '@models/constants';

import { AppColorService } from '@services/app-color/app-color.service';

describe('AppColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: AppColorService;
  let element: HTMLElement;
  const MOUSE_RANDOM_BUTTON = 9;
  beforeEach(() => {
    element = document.createElement('rect');
    service = TestBed.get(AppColorService);
  });

  it('should be created', () => {
    const event = {} as MouseEvent;
    const keyB = {} as KeyboardEvent;
    service.draw(event);
    service.end();
    service.shortcut(keyB, true);
    expect(service).toBeTruthy();
  });

  it('#1 start() should set the stroke to prime color when fill is none', () => {
    service.color.prime = 'fakeColor';
    element.setAttribute('fill', 'none');
    const event = { target: element as EventTarget, buttons: MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe('fakeColor');
  });

  it('#2 start() should set the stroke to prime color when fill is transparent', () => {
    service.color.prime = 'fakeColor';
    element.setAttribute('fill', 'rgba(22,22,22,0)');
    const event = { target: element as EventTarget, buttons: MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe('fakeColor');
  });

  it('#3 start() should set the fill to prime color when fill is defined', () => {
    service.color.prime = 'fakeColor';
    element.setAttribute('fill', 'rgba(22,22,22,0.7)');
    const event = { target: element as EventTarget, buttons: MOUSE_PRIMARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe(null);
    expect(element.getAttribute('fill')).toBe('fakeColor');
  });

  it('#4 start() should set the stroke to second color when fill is defined', () => {
    service.color.second = 'fakeColor';
    element.setAttribute('fill', 'rgba(22,22,22,0.7)');
    const event = { target: element as EventTarget, buttons: MOUSE_SECONDARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe('fakeColor');
    expect(element.getAttribute('fill')).toBe('rgba(22,22,22,0.7)');
  });

  it('#5 start() should not set the stroke to second color when fill is undefined', () => {
    service.color.second = 'fakeColor';
    element.setAttribute('fill', 'none');
    const event = { target: element as EventTarget, buttons: MOUSE_SECONDARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe(null);
    expect(element.getAttribute('fill')).toBe('none');
  });

  it('#6 start() should not set the stroke to second color when fill is transparent', () => {
    service.color.second = 'fakeColor';
    element.setAttribute('fill', 'rgba(22,22,22,0)');
    const event = { target: element as EventTarget, buttons: MOUSE_SECONDARY_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe(null);
    expect(element.getAttribute('fill')).toBe('rgba(22,22,22,0)');
  });

  it('#7 start() should do nothing when a random button is pressed', () => {
    service.color.second = 'fakeColor';
    const event = { target: element as EventTarget, buttons: MOUSE_RANDOM_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe(null);
    expect(element.getAttribute('fill')).toBe(null);
  });

  it('#8 start() should do nothing when is the elementSVG', () => {
    service.color.second = 'fakeColor';
    const elementSVG = document.createElement('svg');
    const event = { target: elementSVG as EventTarget, buttons: MOUSE_RANDOM_BUTTON } as MouseEvent;
    service.start(event);
    expect(element.getAttribute('stroke')).toBe(null);
    expect(element.getAttribute('fill')).toBe(null);
  });
});
