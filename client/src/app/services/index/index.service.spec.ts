import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Message } from '../../../../../common/communication/message';
import { IndexService } from './index.service';

describe('IndexService', () => {
  let httpMock: HttpTestingController;
  let service: IndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(IndexService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return expected message (HttpClient called once)', () => {
    const expectedMessage: Message = { body: 'Hello', title: 'World' };

    // check the content of the mocked call
    service.basicGet().subscribe((response: Message) => {
      expect(response.title).toEqual(expectedMessage.title, 'Title check');
      expect(response.body).toEqual(expectedMessage.body, 'body check');
    }, fail);

    // tslint:disable: no-any
    const req = httpMock.expectOne((service as any).BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush(expectedMessage);
  });

  it('should handle http error safely', () => {
    service.basicGet().subscribe((response: Message) => {
      expect(response).toBeUndefined();
    }, fail);

    const req = httpMock.expectOne((service as any).BASE_URL);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Random error occured'));
  });
});
