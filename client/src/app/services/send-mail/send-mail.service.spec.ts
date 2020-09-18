import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { SendMailService } from './send-mail.service';

describe('SendMailService', () => {
  TestBed.configureTestingModule({
    providers: [
      SendMailService, HttpClient
    ]
  });

  it('should be created', () => {
    const service: SendMailService = TestBed.get(SendMailService);
    expect(service).toBeTruthy();
  });
});
