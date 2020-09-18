import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SavingDialogService } from './saving-dialog.service';

describe('SavingDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [HttpClient, HttpHandler]

  }));

  it('should be created', () => {
    const service: SavingDialogService = TestBed.get(SavingDialogService);
    expect(service).toBeTruthy();
  });

  it('#1 save should call httpClient.post<Drawing[]>  with the correct params', () => {
    const service: SavingDialogService = TestBed.get(SavingDialogService);
    const drawing = { name: 'dessin1', tags: ['tag'], image: 'image', thumbnail: 'vignette', height: 0, width: 0, background: '' };
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(service['http'], 'post');
    service.background = 'red';
    service.saveDrawing(drawing);
    expect(drawing.background).toBe('red');
    expect(spy).toHaveBeenCalledWith(service.url + '/', drawing);
  });

  it('#2 getBackground should set this.background with the value in parameter', () => {
    const service: SavingDialogService = TestBed.get(SavingDialogService);
    service.getBackground('red');
    expect(service.background).toBe('red');
  });
});
