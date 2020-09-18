import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  prime: string;
  second: string;
  tableColor: string[];

  constructor() {
    this.tableColor = new Array<string>();
    this.prime = 'rgba(0, 0, 0, 1)';
    this.second = 'rgba(127, 127, 127, 1)';
  }

  getPrime(): string {
    return this.prime;
  }

  getSecond(): string {
    return this.second;
  }
}
