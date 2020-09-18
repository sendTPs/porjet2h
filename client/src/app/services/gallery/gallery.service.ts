import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Drawing } from '@models/drawing.interface';
import { Tag } from '@models/tag.interface';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    url: string;
    drawingToDisplay: Drawing;
    loadDrawing: boolean;

    constructor(public httpClient: HttpClient) {
        this.url = 'http://localhost:3000/gallery';
        this.loadDrawing = false;
    }

    getAllDrawingsFromDB(): Observable<Drawing[]> {
        return this.httpClient.get<Drawing[]>(this.url + '/');
    }

    getDrawingsByTagFromDB(tag: string): Observable<Drawing[]> {
        const params1 = new HttpParams().set('tags', tag);

        return this.httpClient.get<Drawing[]>(this.url + '/tags', { params: params1 });

    }

    getAllTagsNames(): Observable<Tag[]> {
        return this.httpClient.get<Tag[]>(this.url + '/allTags');
    }

    deleteDrawing(toDelete: string): Observable<object> {
        const params1 = new HttpParams().set('name', toDelete);
        return this.httpClient.delete(this.url + '/name', { params: params1 });
    }

    loadDrawingOnWorkspace(drawing: Drawing): Drawing {
        this.drawingToDisplay = drawing;
        return this.drawingToDisplay;
    }

}
