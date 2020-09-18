import { TestBed } from '@angular/core/testing';

import { SketchService } from './sketch.service';

describe('SketchService', () => {
  let service: SketchService;
  const N10 = 10;
  const N9 = 9;

  beforeEach(() => {
    service = TestBed.get(SketchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 add should work', () => {
    const html = {} as HTMLElement;
    service.add(html);
    expect(service.addCommand).toBeTruthy();
  });

  it('#2 remove should work', () => {
    const html = {} as HTMLElement;
    service.elementContainer.push(html);
    service.remove();
    expect(service.addCommand).toBeFalsy();
    expect(service.elementContainer.length).toBe(0);
  });

  it('#3 clear should work', () => {
    const html = {} as HTMLElement;
    service.elementContainer.push(html);
    service.clear();
    expect(service.addCommand).toBeFalsy();
    expect(service.elementContainer.length).toBe(0);
  });

  it('#4 delete should delete the good element', () => {
    for (let index = 0; index < N10; index++) {
      service.elementContainer.push(document.createElement('rect'));
    }
    const element = service.elementContainer[2];
    service.delete(element);
    expect(service.elementContainer.length).toBe(N9);
    expect(service.elementContainer.includes(element)).toBe(false);
  });

  it('#5 delete should delete nothing', () => {
    for (let index = 0; index < N10; index++) {
      service.elementContainer.push(document.createElement('rect'));
    }
    const element = document.createElement('rect');
    service.delete(element);
    expect(service.elementContainer.length).toBe(N10);
    expect(service.elementContainer.includes(element)).toBe(false);
  });
});
