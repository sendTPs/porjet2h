import { TestBed } from '@angular/core/testing';

import { SVGService } from './svg.service';

describe('SvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SVGService = TestBed.get(SVGService);
    expect(service).toBeTruthy();
  });
});
