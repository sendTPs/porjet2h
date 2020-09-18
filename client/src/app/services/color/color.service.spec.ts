import { TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
  let service: ColorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return prime color ', () => {
    service.prime = 'red';
    expect(service.getPrime()).toBe('red');
  });

  it('should return second color', () => {
    service.second = 'blue';
    expect(service.getSecond()).toBe('blue');
  });

  it('should return prime color default', () => {
    expect(service.getPrime()).toBe('rgba(0, 0, 0, 1)');
  });

  it('should return second color default', () => {
    expect(service.getSecond()).toBe('rgba(127, 127, 127, 1)');
  });

});
