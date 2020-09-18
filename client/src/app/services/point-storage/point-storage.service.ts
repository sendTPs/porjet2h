import { Injectable } from '@angular/core';

import { Point2d } from '@models/point2d.class';

@Injectable({
  providedIn: 'root'
})
export class PointStorageService {

  storage: Point2d[];
  index: number;

  constructor() {
    this.storage = new Array<Point2d>();
    this.index = 0;
  }

  getStorage(): Point2d[] {
    return this.storage;
  }

  addToStorage(point: Point2d): void {
    this.storage.push(point);
    this.index++;
  }

  getIndex(): number {
    return this.index;
  }

  deleteLastPosition(): void {
    if (this.storage.length !== 0) {
      this.storage.pop();
      this.index--;
    }
  }

  clearStorage(): void {
    this.index = 0;
    this.storage = new Array<Point2d>();
  }
}
