import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Tag } from '@app/models/tag.interface';
import { Drawing } from '@models/drawing.interface';

@Injectable({
  providedIn: 'root'
})
export class SavingDialogService {

  url: string;
  tags: Tag[];
  fistSaving: boolean;
  background: string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/save-drawing';
    this.tags = [];
  }

  saveDrawing(drawing: Drawing): Observable<Drawing> {
    drawing.background = this.background;
    return this.http.post<Drawing>(this.url + '/', drawing);
  }

  getBackground(background: string): void {
    this.background = background;
  }

}
