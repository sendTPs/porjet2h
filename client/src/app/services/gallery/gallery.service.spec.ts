import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { Drawing } from '@app/models/drawing.interface';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let service: GalleryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [HttpClient, HttpHandler]

    })
      .compileComponents();
    service = TestBed.get(GalleryService);
  }));

  it('should be created', async () => {

    expect(service).toBeTruthy();

  });

  it('#1 getAllDrawingsFromDB should call httpClient.get<Drawing[]>', async () => {
    const spy = spyOn(service.httpClient, 'get');
    service.getAllDrawingsFromDB();
    expect(spy).toHaveBeenCalled();
  });

  it('#2 getDrawingsByTagFromDB should call httpClient.get<Drawing[]>  with the correct params', async () => {
    const spy = spyOn(service.httpClient, 'get');
    const tag1 = 'tag1';
    const params = new HttpParams().set('tags', tag1);
    service.getDrawingsByTagFromDB(tag1);
    expect(spy).toHaveBeenCalledWith(service.url + '/tags', { params });
  });

  it('#3 deleteDrawing should call httpClient.delete  with the correct params', async () => {
    const spy = spyOn(service.httpClient, 'delete');
    const name = 'dessin1';
    const params = new HttpParams().set('name', name);
    service.deleteDrawing(name);
    expect(spy).toHaveBeenCalledWith(service.url + '/name', { params });

  });

  it('#4 getAllTagsNames should call httpClient.get<Drawing[]> with the correct params', async () => {
    const spy = spyOn(service.httpClient, 'get');
    service.getAllTagsNames();
    expect(spy).toHaveBeenCalledWith(service.url + '/allTags');
  });

  it('#5 loadDrawingOnWorkspace should define this.drawingToDisplay', async () => {
    const drawing = { name: 'dessin1', tags: ['tag'], image: 'image', thumbnail: 'vignette', height: 0, width: 0, background: '' };
    service.loadDrawingOnWorkspace(drawing as Drawing);
    expect(service.drawingToDisplay).toBe(drawing);
  });

});
