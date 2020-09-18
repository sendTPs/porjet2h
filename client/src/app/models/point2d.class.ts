import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Point2d {
  x: number;
  y: number;
  constructor(cx: number = 0, cy: number = 0) {
    this.x = cx;
    this.y = cy;
  }

  toString(): string {
    return `${this.x}:${this.y}`;
  }

}
